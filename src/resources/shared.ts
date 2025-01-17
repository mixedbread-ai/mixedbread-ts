// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Represents a filter with AND, OR, and NOT conditions.
 */
export interface SearchFilter {
  /**
   * List of conditions or filters to be ANDed together
   */
  all?: Array<SearchFilter | SearchFilter.SearchFilterCondition> | null;

  /**
   * List of conditions or filters to be ORed together
   */
  any?: Array<SearchFilter | SearchFilter.SearchFilterCondition> | null;

  /**
   * List of conditions or filters to be NOTed
   */
  none?: Array<SearchFilter | SearchFilter.SearchFilterCondition> | null;
}

export namespace SearchFilter {
  /**
   * Represents a condition with a field, operator, and value.
   */
  export interface SearchFilterCondition {
    /**
     * The field to apply the condition on
     */
    key: string;

    /**
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
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
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
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
     * The operator for the condition
     */
    operator: 'eq' | 'not_eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'like' | 'not_like';

    /**
     * The value to compare against
     */
    value: unknown;
  }
}
