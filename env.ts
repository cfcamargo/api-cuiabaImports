/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
	HOST: Env.schema.string.optional({ format: 'host' }),
	PORT: Env.schema.number.optional(),
	APP_NAME: Env.schema.string(),
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),

	GOOGLE_SHEETS_API_KEY:Env.schema.string(),
	GOOGLE_SHEETS_SPREADSHEET_ID:Env.schema.string()
})
