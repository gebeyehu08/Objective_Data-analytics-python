from modelhub import ModelHub


def test_compare_decorator_limiting(objectiv_df, monkeypatch) -> None:
    modelhub = ModelHub(time_aggregation='%Y-%m-%d')
    # add conversion event
    modelhub.add_conversion_event(
        location_stack=objectiv_df.location_stack.json[{'_type': 'LinkContext', 'id': 'cta-repo-button'}:],
        event_type='ClickEvent',
        name='github_clicks',
    )

    decorated_pch = modelhub.map.pre_conversion_hit_number(objectiv_df, 'github_clicks')

    monkeypatch.setattr(
        'modelhub.decorators._get_extra_series_to_include_from_params',
        lambda *args, **kwargs: objectiv_df.columns,
    )
    mocked_decorated_pch = modelhub.map.pre_conversion_hit_number(objectiv_df, 'github_clicks')

    # final node
    assert len(decorated_pch.base_node.column_expressions) == 10
    assert len(mocked_decorated_pch.base_node.column_expressions) == 14

    # result from materialization of __conversions max window function
    dec_prev_node = decorated_pch.base_node.references['prev']
    mocked_dec_prev_node = mocked_decorated_pch.base_node.references['prev']
    assert len(dec_prev_node.column_expressions) == 9
    assert len(mocked_dec_prev_node.column_expressions) == 13

    # result from conversions in time calculation
    dec_prev_node = dec_prev_node.references['prev']
    mocked_dec_prev_node = mocked_dec_prev_node.references['prev']
    assert len(dec_prev_node.column_expressions) == 8
    assert len(mocked_dec_prev_node.column_expressions) == 12

    # initial objectiv_df
    dec_prev_node = dec_prev_node.references['prev']
    mocked_dec_prev_node = mocked_dec_prev_node.references['prev']
    assert dec_prev_node == objectiv_df.base_node
    assert mocked_dec_prev_node == objectiv_df.base_node
    assert len(dec_prev_node.column_expressions) == len(objectiv_df.base_node.column_expressions)
    assert len(mocked_dec_prev_node.column_expressions) == len(objectiv_df.base_node.column_expressions)
