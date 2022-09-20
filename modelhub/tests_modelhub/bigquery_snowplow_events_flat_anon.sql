-- Query to create data for events_flat_anon table from events table on BQ
WITH
`old` AS (
  SELECT
    collector_tstamp,
    `contexts_io_objectiv_taxonomy_1_0_0`[OFFSET(0)] as tax,
    PARSE_JSON(`contexts_io_objectiv_taxonomy_1_0_0`[OFFSET(0)].global_contexts) as gc
  FROM `objectiv-snowplow-test-2.modelhub_test.events`
),
`raw` AS (
  SELECT
    collector_tstamp,
    tax.`_type`,
    tax.`_types`,
    tax.cookie_id,
    tax.event_id,
    tax.`time`,
    ARRAY(SELECT AS STRUCT tax.location_stack as `location_stack`) AS ls,
    ARRAY(select as struct
        first_value(json_value(ctx, '$."id"')) over (order by pos) AS id
      from unnest(json_query_array(gc, '$')) as ctx with offset as pos
      where json_value(ctx, '$."_type"') = """ApplicationContext"""
    ) as `application`,
    ARRAY(select as struct
        first_value(json_value(ctx, '$."id"')) over (order by pos) AS id,
        first_value(json_value(ctx, '$."referrer"')) over (order by pos) AS referrer,
        first_value(json_value(ctx, '$."user_agent"')) over (order by pos) AS user_agent,
        first_value(json_value(ctx, '$."remote_address"')) over (order by pos) AS remote_address,
      from unnest(json_query_array(gc, '$')) as ctx with offset as pos
      where json_value(ctx, '$."_type"') = """HttpContext"""
    ) as `http`,
    ARRAY(select as struct
        # Cookie ID data in table is WRONG
        tax.cookie_id AS id,
        tax.cookie_id AS cookie_id,
    ) as `cookie`,
    ARRAY(select as struct
        json_value(ctx, '$."id"') AS id,
        json_value(ctx, '$."value"') AS value,
      from unnest(json_query_array(gc, '$')) as ctx with offset as pos
      where json_value(ctx, '$."_type"') = """IdentityContext"""
      order by pos
    ) as `identity`,

  FROM `old`
) SELECT
  `_type` AS `se_action`,
  `_types` AS `se_category`,
  (CASE WHEN event_id in ('12b55ed5-4295-4fc1-bf1f-88d64d1ac304', '12b55ed5-4295-4fc1-bf1f-88d64d1ac305') THEN NULL ELSE `cookie_id` END) AS `network_userid`,
  (CASE WHEN event_id in ('12b55ed5-4295-4fc1-bf1f-88d64d1ac304', '12b55ed5-4295-4fc1-bf1f-88d64d1ac305') THEN `cookie_id` ELSE NULL END) AS `domain_sessionid`,
  `event_id` AS `event_id`,

  -- time, mostly mocked in test data
  TIMESTAMP_MILLIS(`time`) AS `true_tstamp`,
  TIMESTAMP_MILLIS(`time`) AS `derived_tstamp`,
  TIMESTAMP_MILLIS(`time`) AS `dvce_sent_tstamp`,
  TIMESTAMP_MILLIS(`time`) AS `dvce_created_tstamp`,
  `collector_tstamp` AS `collector_tstamp`,

  -- fields filled from contexts
  application[OFFSET(0)].id as app_id,
  http[OFFSET(0)].referrer as page_referrer,
  http[OFFSET(0)].remote_address as user_ipaddress,

  -- not available in test data
  CAST(NULL AS string) as page_url,

  ls AS `contexts_io_objectiv_location_stack_1_0_0`,
  application AS `contexts_io_objectiv_context_application_context_1_0_0`,
  http AS `contexts_io_objectiv_context_http_context_1_0_0`,
  identity AS `contexts_io_objectiv_context_identity_context_1_0_0`,
  cookie AS `contexts_io_objectiv_context_cookie_id_context_1_0_0`

FROM `raw`
