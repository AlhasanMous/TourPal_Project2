<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Styles / Scripts -->
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <style>
            /* Laravel default welcome page fallback styles */
            *,
            ::after,
            ::before {
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb
            }

            html {
                line-height: 1.5;
                -webkit-text-size-adjust: 100%;
                font-family: ui-sans-serif, system-ui, sans-serif
            }

            body {
                margin: 0;
                background-color: #FDFDFC;
                color: #1b1b18
            }

            .relative {
                position: relative
            }

            .flex {
                display: flex
            }

            .min-h-screen {
                min-height: 100vh
            }

            .flex-col {
                flex-direction: column
            }

            .items-center {
                align-items: center
            }

            .justify-center {
                justify-content: center
            }

            .text-center {
                text-align: center
            }

            .text-4xl {
                font-size: 2.25rem;
                line-height: 2.5rem
            }

            .font-semibold {
                font-weight: 600
            }
        </style>
    @endif
</head>

<body class="relative flex min-h-screen flex-col items-center justify-center text-center">
    <div class="text-4xl font-semibold">
        Laravel
    </div>
</body>

</html>
