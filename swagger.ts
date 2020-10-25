export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Marvel Character APIs Document',
        description: 'Access the latest details about Marvel characters.',
        contact: {
            name: 'Neil Paul Molina',
            email: 'get.neilmolina@gmail.com',
            url: 'https://neilmolina.com'
        },
    },
    servers: [
        {
            url: 'http://localhost:8080',
            description: 'Marvel Character API server',
        }
    ],
    paths: {
        '/characters': {
            get: {
                description: 'Returns all ids of the characters in the Marvel Universe.',
                responses: {
                    '200': {
                        description: 'list of ids.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'integer'
                                    },
                                    examples: [
                                        1009144,
                                        1009146,
                                        1009148,
                                        1009149,
                                        1009152,
                                        1009153,
                                        1009154,
                                        1009156
                                    ]
                                },
                                example: [
                                    1009149,
                                    1009152,
                                    1009153,
                                    1009154,
                                    1009156
                                ]
                            }
                        }
                    }
                }
            }
        },
        '/characters/{character_id}': {
            get: {
                description: 'Returns the details of a specific character.',
                parameters: [
                    {
                        in: 'path',
                        name: 'character_id',
                        description: 'numeric id of the marvel character',
                        schema: {
                            type: 'integer',
                            default: '1009223'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'details of the character',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    item: {
                                        id: {
                                            type: 'number',
                                            description: 'Marvel Character id.'
                                        },
                                        name: {
                                            type: 'string',
                                            description: 'Character name possible also an organization name in the Marvel Universe.'
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Know more about the character.'
                                        }
                                    },
                                    example: { 
                                        "id": 1010987, 
                                        "name": "Unus (Age of Apocalypse)", 
                                        "description": "Unus worked for Apocalypse and was sent into Old New York City to search for any remaining humans there and to kill them." 
                                    }
                                }
                            }
                        }
                    },
                    '404': {
                        description: 'character id does not exist in the cache.',
                        content: {
                            'text/html': {
                                content: 'character not found'
                            }
                        }
                    }
                },
            }

        }
    }
}