// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as Core from '../../../core';

export class Schema extends APIResource {
  /**
   * Create a schema with the provided parameters.
   *
   * Args: params: JsonSchemaCreateParams The parameters for creating a schema.
   *
   * Returns: CreatedJsonSchema: The created schema.
   */
  create(body: SchemaCreateParams, options?: Core.RequestOptions): Core.APIPromise<CreatedJsonSchema> {
    return this._client.post('/v1/document-ai/extract/schema', { body, ...options });
  }

  /**
   * Enhance a schema by enriching the descriptions to aid extraction.
   *
   * Args: params: JsonSchemaEnhanceParams The parameters for enhancing a schema.
   *
   * Returns: EnhancedJsonSchema: The enhanced schema.
   */
  enhance(body: SchemaEnhanceParams, options?: Core.RequestOptions): Core.APIPromise<EnhancedJsonSchema> {
    return this._client.post('/v1/document-ai/extract/schema/enhance', { body, ...options });
  }

  /**
   * Validate a schema.
   *
   * Args: params: JsonSchemaValidateParams The parameters for validating a schema.
   *
   * Returns: ValidatedJsonSchema: The validation result.
   */
  validate(body: SchemaValidateParams, options?: Core.RequestOptions): Core.APIPromise<ValidatedJsonSchema> {
    return this._client.post('/v1/document-ai/extract/schema/validate', { body, ...options });
  }
}

/**
 * Result of a schema creation operation.
 *
 * Contains the created schema and any associated metadata.
 */
export interface CreatedJsonSchema {
  /**
   * The created schema definition
   */
  json_schema: unknown;
}

/**
 * Result of a schema enhancement operation.
 *
 * Contains the enhanced schema with enriched descriptions and metadata.
 */
export interface EnhancedJsonSchema {
  /**
   * The enhanced schema with enriched descriptions
   */
  json_schema: unknown;
}

/**
 * Result of a schema validation operation.
 *
 * Contains validation status and any validation errors found.
 */
export interface ValidatedJsonSchema {
  /**
   * Whether the schema is valid
   */
  is_valid: boolean;

  /**
   * The schema definition
   */
  json_schema: unknown;

  /**
   * List of validation errors if any
   */
  errors?: Array<string>;
}

export interface SchemaCreateParams {
  /**
   * Natural language description of the schema to create
   */
  description: string;
}

export interface SchemaEnhanceParams {
  /**
   * The base schema to enhance
   */
  json_schema: unknown;
}

export interface SchemaValidateParams {
  /**
   * The schema definition to validate
   */
  json_schema: unknown;
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
