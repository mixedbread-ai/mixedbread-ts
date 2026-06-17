// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Represents a filter with AND, OR, and NOT conditions.
 */
export interface SearchFilter {
  /**
   * List of conditions or filters to be ANDed together
   */
  all?: Array<SearchFilter | SearchFilterCondition> | null;

  /**
   * List of conditions or filters to be ORed together
   */
  any?: Array<SearchFilter | SearchFilterCondition> | null;

  /**
   * List of conditions or filters to be NOTed
   */
  none?: Array<SearchFilter | SearchFilterCondition> | null;
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
    | 'starts_with'
    | 'not_like'
    | 'regex';
}

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
