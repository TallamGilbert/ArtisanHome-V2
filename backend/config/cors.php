<?php

return [
    'paths'                    => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => array_filter([
        env('FRONTEND_URL'),                                          // production: https://yourstore.com
        env('APP_ENV') === 'local' ? 'http://localhost:5173'  : null,
        env('APP_ENV') === 'local' ? 'http://localhost:3000'  : null,
        env('APP_ENV') === 'local' ? 'http://127.0.0.1:5173' : null,
        env('APP_ENV') === 'local' ? 'http://127.0.0.1:3000' : null,
    ]),
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => true,
];
