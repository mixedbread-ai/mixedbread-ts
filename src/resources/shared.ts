// File generated from our OpenAPI spec by sdkgen. See CONTRIBUTING.md for details.

export interface Usage {
  /**
   * The number of tokens used for the prompt
   */
  prompt_tokens: number;

  /**
   * The total number of tokens used
   */
  total_tokens: number;

  /**
   * The number of tokens used for the completion
   */
  completion_tokens?: number | null;
}

/**
 * Represents a filter with AND, OR, and NOT conditions.
 */
export interface SearchFilter {
  /**
   * List of conditions or filters to be ANDed together
   */
  all?: Array<SearchFilter.All> | null;

  /**
   * List of conditions or filters to be ORed together
   */
  any?: Array<SearchFilter.Any> | null;

  /**
   * List of conditions or filters to be NOTed
   */
  none?: Array<SearchFilter.None> | null;
}

export namespace SearchFilter {
  export type All = SearchFilter | SearchFilterCondition;

  export type Any = SearchFilter | SearchFilterCondition;

  export type None = SearchFilter | SearchFilterCondition;
}

/**
 * Represents a condition with a field, operator, and value.
 */
export interface SearchFilterCondition {
  /**
   * The field to apply the condition on
   */
  key: string;

  /**
   * The value to compare against
   */
  value: unknown;

  /**
   * The operator for the condition
   */
  operator:
    | 'eq'
    | 'not_eq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'not_in'
    | 'like'
    | 'contains'
    | 'starts_with'
    | 'not_like'
    | 'regex';
}
