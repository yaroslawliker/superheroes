

export const ERRORS = {
    INTERNAL_ERROR: {
        code: "no_such_id",
        message: "No hero with such id."
    },

    VALIDATION_ERROR: {
        message: "Validation Error",
        code: "validation_error"
    },

    NO_SUCH_ID: {
        code: "no_such_id",
        message: "No hero with such id."
    },

    missingField(fieldName: string) {
        return {
            code: "missing_field",
            message: `Missing '${fieldName}' field`
        }
    },

    INVALID_JSON: { 
        code: "invalid_json",
        message: "Invalid JSON format in 'data'",
    },

    NO_IMAGES: {
        code: "no_images",
        message: "At least one image required" 
    }
}