const {
  ApplicationContext,
  RootLocationContext,
  ContentContext,
  CookieIdContext,
  ExpandableContext,
  InputContext,
  PressableContext,
  OverlayContext,
  PathContext,
  NavigationContext,
  MediaPlayerContext,
  HttpContext,
  IdentityContext,
  InputValueContext,
  LinkContext,
  LocaleContext,
  MarketingContext,
  SessionContext,
} = require('./validator');

describe('Contexts', () => {
  describe('ApplicationContext', () => {
    it('should parse successfully', () => {
      expect(
        ApplicationContext.safeParse({
          _type: 'ApplicationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        ApplicationContext.safeParse({
          _type: 'ApplicationContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        ApplicationContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        ApplicationContext.safeParse({
          _type: 'ApplicationContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        ApplicationContext.safeParse({
          _type: 'ApplicationContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        ApplicationContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        ApplicationContext.safeParse({
          _type: 'RootApplicationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('ContentContext', () => {
    it('should parse successfully', () => {
      expect(
        ContentContext.safeParse({
          _type: 'ContentContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        ContentContext.safeParse({
          _type: 'ContentContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        ContentContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        ContentContext.safeParse({
          _type: 'ContentContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        ContentContext.safeParse({
          _type: 'ContentContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        ContentContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        ContentContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('CookieIdContext', () => {
    it('should parse successfully', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 'CookieIdContext',
          id: 'test',
          cookie_id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 'CookieIdContext',
          id: 123,
          cookie_id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 123,
          id: 'test',
          cookie_id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 'CookieIdContext',
          id: 'test',
          cookie_id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 'CookieIdContext',
          cookie_id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        CookieIdContext.safeParse({
          id: 'test',
          cookie_id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `cookie_id`', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 'CookieIdContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        CookieIdContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          cookie_id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('ExpandableContext', () => {
    it('should parse successfully', () => {
      expect(
        ExpandableContext.safeParse({
          _type: 'ExpandableContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        ExpandableContext.safeParse({
          _type: 'ExpandableContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        ExpandableContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        ExpandableContext.safeParse({
          _type: 'ExpandableContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        ExpandableContext.safeParse({
          _type: 'ExpandableContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        ExpandableContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        ExpandableContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('HttpContext', () => {
    it('should parse successfully', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 'test',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should parse successfully with `remote_address` set to null', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 'test',
          referrer: 'test',
          user_agent: 'test',
          remote_address: null,
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 123,
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        HttpContext.safeParse({
          _type: 123,
          id: 'test',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `referrer` type', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 'test',
          referrer: 123,
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `user_agent` type', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 'test',
          referrer: 'test',
          user_agent: 123,
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `remote_address` type', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 'test',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          id: 'test',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        HttpContext.safeParse({
          _type: 'HttpContext',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        HttpContext.safeParse({
          id: 'test',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_referrer`', () => {
      expect(
        HttpContext.safeParse({
          id: 'test',
          _type: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `user_agent`', () => {
      expect(
        HttpContext.safeParse({
          id: 'test',
          _type: 'test',
          referrer: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        HttpContext.safeParse({
          id: 'test',
          _type: 'RootLocationContext',
          referrer: 'test',
          user_agent: 'test',
          remote_address: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('IdentityContext', () => {
    it('should parse successfully', () => {
      expect(
        IdentityContext.safeParse({
          _type: 'IdentityContext',
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        IdentityContext.safeParse({
          _type: 'IdentityContext',
          id: 123,
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        IdentityContext.safeParse({
          _type: 123,
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `value` type', () => {
      expect(
        IdentityContext.safeParse({
          _type: 'IdentityContext',
          id: 'test',
          value: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        IdentityContext.safeParse({
          _type: 'IdentityContext',
          id: 'test',
          value: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        IdentityContext.safeParse({
          _type: 'IdentityContext',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        IdentityContext.safeParse({
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `value`', () => {
      expect(
        IdentityContext.safeParse({
          id: 'test',
          _type: 'IdentityContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        IdentityContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('InputContext', () => {
    it('should parse successfully', () => {
      expect(
        InputContext.safeParse({
          _type: 'InputContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        InputContext.safeParse({
          _type: 'InputContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        InputContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        InputContext.safeParse({
          _type: 'InputContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        InputContext.safeParse({
          _type: 'InputContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        InputContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        InputContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('InputValueContext', () => {
    it('should parse successfully', () => {
      expect(
        InputValueContext.safeParse({
          _type: 'InputValueContext',
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        InputValueContext.safeParse({
          _type: 'InputValueContext',
          id: 123,
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        InputValueContext.safeParse({
          _type: 123,
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `value` type', () => {
      expect(
        InputValueContext.safeParse({
          _type: 'InputValueContext',
          id: 'test',
          value: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        InputValueContext.safeParse({
          _type: 'InputValueContext',
          id: 'test',
          value: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        InputValueContext.safeParse({
          _type: 'InputValueContext',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        InputValueContext.safeParse({
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `value`', () => {
      expect(
        InputValueContext.safeParse({
          id: 'test',
          _type: 'InputValueContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        InputValueContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          value: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('LinkContext', () => {
    it('should parse successfully', () => {
      expect(
        LinkContext.safeParse({
          _type: 'LinkContext',
          id: 'test',
          href: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        LinkContext.safeParse({
          _type: 'LinkContext',
          id: 123,
          href: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        LinkContext.safeParse({
          _type: 123,
          id: 'test',
          href: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `value` type', () => {
      expect(
        LinkContext.safeParse({
          _type: 'LinkContext',
          id: 'test',
          href: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        LinkContext.safeParse({
          _type: 'LinkContext',
          id: 'test',
          href: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        LinkContext.safeParse({
          _type: 'LinkContext',
          href: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        LinkContext.safeParse({
          id: 'test',
          href: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `href`', () => {
      expect(
        LinkContext.safeParse({
          id: 'test',
          _type: 'LinkContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        LinkContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          href: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('LocaleContext', () => {
    it('should parse successfully', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'LocaleContext',
          id: 'test',
          language_code: null,
          country_code: null,
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'LocaleContext',
          id: 123,
          language_code: null,
          country_code: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        LocaleContext.safeParse({
          _type: 123,
          id: 'test',
          language_code: null,
          country_code: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `language_code` type', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'LocaleContext',
          id: 'test',
          language_code: 123,
          country_code: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `country_code` type', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'LocaleContext',
          id: 'test',
          language_code: null,
          country_code: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'LocaleContext',
          id: 'test',
          language_code: null,
          country_code: null,
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'LocaleContext',
          language_code: null,
          country_code: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        LocaleContext.safeParse({
          id: 'test',
          language_code: null,
          country_code: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        LocaleContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          language_code: null,
          country_code: null,
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('MarketingContext', () => {
    it('should parse successfully', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 123,
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 123,
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `source` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 123,
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `medium` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 123,
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `campaign` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 123,
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `term` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: 123,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `content` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: 123,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `source_platform` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: 123,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `creative_format` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: 123,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `marketing_tactic` type', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'MarketingContext',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        MarketingContext.safeParse({
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        MarketingContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          source: 'test',
          medium: 'test',
          campaign: 'test',
          term: null,
          content: null,
          source_platform: null,
          creative_format: null,
          marketing_tactic: null,
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('MediaPlayerContext', () => {
    it('should parse successfully', () => {
      expect(
        MediaPlayerContext.safeParse({
          _type: 'MediaPlayerContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        MediaPlayerContext.safeParse({
          _type: 'MediaPlayerContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        MediaPlayerContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        MediaPlayerContext.safeParse({
          _type: 'MediaPlayerContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        MediaPlayerContext.safeParse({
          _type: 'MediaPlayerContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        MediaPlayerContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        MediaPlayerContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('NavigationContext', () => {
    it('should parse successfully', () => {
      expect(
        NavigationContext.safeParse({
          _type: 'NavigationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        NavigationContext.safeParse({
          _type: 'NavigationContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        NavigationContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        NavigationContext.safeParse({
          _type: 'NavigationContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        NavigationContext.safeParse({
          _type: 'NavigationContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        NavigationContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        NavigationContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('OverlayContext', () => {
    it('should parse successfully', () => {
      expect(
        OverlayContext.safeParse({
          _type: 'OverlayContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        OverlayContext.safeParse({
          _type: 'OverlayContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        OverlayContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        OverlayContext.safeParse({
          _type: 'OverlayContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        OverlayContext.safeParse({
          _type: 'OverlayContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        OverlayContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        OverlayContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('PathContext', () => {
    it('should parse successfully', () => {
      expect(
        PathContext.safeParse({
          _type: 'PathContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        PathContext.safeParse({
          _type: 'PathContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        PathContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        PathContext.safeParse({
          _type: 'PathContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        PathContext.safeParse({
          _type: 'PathContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        PathContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        PathContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('PressableContext', () => {
    it('should parse successfully', () => {
      expect(
        PressableContext.safeParse({
          _type: 'PressableContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        PressableContext.safeParse({
          _type: 'PressableContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        PressableContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        PressableContext.safeParse({
          _type: 'PressableContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        PressableContext.safeParse({
          _type: 'PressableContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        PressableContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        PressableContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('RootLocationContext', () => {
    it('should parse successfully', () => {
      expect(
        RootLocationContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        RootLocationContext.safeParse({
          _type: 'RootLocationContext',
          id: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        RootLocationContext.safeParse({
          _type: 123,
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        RootLocationContext.safeParse({
          _type: 'RootLocationContext',
          id: 'test',
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        RootLocationContext.safeParse({
          _type: 'RootLocationContext',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        RootLocationContext.safeParse({
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        RootLocationContext.safeParse({
          _type: 'ApplicationContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });
  });

  describe('SessionContext', () => {
    it('should parse successfully', () => {
      expect(
        SessionContext.safeParse({
          _type: 'SessionContext',
          id: 'test',
          hit_number: 0,
          _types: [],
        }).success
      ).toBe(true);
    });

    it('should fail due to wrong `id` type', () => {
      expect(
        SessionContext.safeParse({
          _type: 'SessionContext',
          id: 123,
          hit_number: 0,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `_type` type', () => {
      expect(
        SessionContext.safeParse({
          _type: 123,
          id: 'test',
          hit_number: 0,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to wrong `hit_number` type', () => {
      expect(
        SessionContext.safeParse({
          _type: 'SessionContext',
          id: 'test',
          hit_number: '0',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to an extra property', () => {
      expect(
        SessionContext.safeParse({
          _type: 'SessionContext',
          id: 'test',
          hit_number: 0,
          extra: 123,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `id`', () => {
      expect(
        SessionContext.safeParse({
          _type: 'SessionContext',
          hit_number: 0,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `_type`', () => {
      expect(
        SessionContext.safeParse({
          id: 'test',
          hit_number: 0,
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to missing `hit_number`', () => {
      expect(
        SessionContext.safeParse({
          _type: 'SessionContext',
          id: 'test',
          _types: [],
        }).success
      ).toBe(false);
    });

    it('should fail due to mismatching `_type`', () => {
      expect(
        SessionContext.safeParse({
          _type: 'ApplicationContext',
          id: 'test',
          hit_number: 0,
          _types: [],
        }).success
      ).toBe(false);
    });
  });
});
