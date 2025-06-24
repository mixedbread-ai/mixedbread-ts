// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Schema extends APIResource {
  /**
   * Create a schema with the provided parameters.
   *
   * Args: params: The parameters for creating a schema.
   *
   * Returns: The created schema.
   */
  create(body: SchemaCreateParams, options?: RequestOptions): APIPromise<CreatedJsonSchema> {
    return this._client.post('/v1/extractions/schema', { body, ...options });
  }

  /**
   * Enhance a schema by enriching the descriptions to aid extraction.
   *
   * Args: params: The parameters for enhancing a schema.
   *
   * Returns: The enhanced schema.
   */
  enhance(body: SchemaEnhanceParams, options?: RequestOptions): APIPromise<EnhancedJsonSchema> {
    return this._client.post('/v1/extractions/schema/enhance', { body, ...options });
  }

  /**
   * Validate a schema.
   *
   * Args: params: The parameters for validating a schema.
   *
   * Returns: The validation result.
   */
  validate(body: SchemaValidateParams, options?: RequestOptions): APIPromise<ValidatedJsonSchema> {
    return this._client.post('/v1/extractions/schema/validate', { body, ...options });
  }
}

/**
 * Result of creating a JSON schema.
 */
export interface CreatedJsonSchema {
  /**
   * The created JSON schema
   */
  json_schema: { [key: string]: unknown };
}

/**
 * Result of enhancing a JSON schema.
 */
export interface EnhancedJsonSchema {
  /**
   * The enhanced JSON schema
   */
  json_schema: { [key: string]: unknown };
}

/**
 * Result of validating a JSON schema.
 */
export interface ValidatedJsonSchema {
  /**
   * Whether the schema is valid
   */
  is_valid: boolean;

  /**
   * List of validation errors
   */
  errors: Array<string>;

  /**
   * The validated JSON schema
   */
  json_schema: { [key: string]: unknown };
}

export interface SchemaCreateParams {
  /**
   * Description of the data to extract
   */
  description: string;
}

export interface SchemaEnhanceParams {
  /**
   * The JSON schema to enhance
   */
  json_schema: { [key: string]: unknown };
}

export interface SchemaValidateParams {
  /**
   * The JSON schema to validate
   */
  json_schema: { [key: string]: unknown };
}

export declare namespace Schema {
  export {
    type CreatedJsonSchema as CreatedJsonSchema,
    type EnhancedJsonSchema as EnhancedJsonSchema,
    type ValidatedJsonSchema as ValidatedJsonSchema,
    type SchemaCreateParams as SchemaCreateParams,
    type SchemaEnhanceParams as SchemaEnhanceParams,
    type SchemaValidateParams as SchemaValidateParams,
  };
}
