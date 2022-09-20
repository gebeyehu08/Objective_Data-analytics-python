# Initialize database and table - Testing

**Important** - Before creating a database and table for modelhub tests, please go through the following
instructions of how to setup Athena: [Bach: Initialize database - Testing](https://github.com/objectiv/objectiv-analytics/blob/main/bach/tests/athena-setup-test-db.md)

In this documentation, we assume the following:
1. The s3 staging bucket is named `obj-automated-tests`
2. Location for testing data is `s3://obj-automated-tests/modelhub_test/staging/`

When setting up a new Athena/S3 environment make sure to edit those values appropriately.

## Testing Data 
Since Athena reads data directly from an S3 bucket,  please create a new folder named
`modelhub_test` and upload the following TSV file into it: [unflattened_events.tsv](https://github.com/objectiv/objectiv-analytics/tree/main/modelhub/tests_modelhub/doc_testing_setups/athena_test_setup/unflattened_events.tsv)

## Create Database
```sql
CREATE DATABASE automated_tests.modelhub_test;
```

## Create Table

```sql
CREATE EXTERNAL TABLE `events`(
  `se_action` string, 
  `se_category` string, 
  `network_userid` string, 
  `domain_sessionid` string,
  `event_id` string, 
  `true_tstamp` timestamp, 
  `derived_tstamp` timestamp, 
  `dvce_sent_tstamp` timestamp, 
  `dvce_created_tstamp` timestamp, 
  `collector_tstamp` timestamp, 
  `app_id` string, 
  `page_referrer` string, 
  `user_ipaddress` string, 
  `page_url` string, 
  `contexts` string)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY '\t'
ESCAPED BY '\\'
LINES TERMINATED BY '\n'
STORED AS INPUTFORMAT 
  'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION
  's3://obj-automated-tests/modelhub_test/staging/'
TBLPROPERTIES ('classification'='tsv')
```
