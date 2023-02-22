/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Application from '@ioc:Adonis/Core/Application'

Route.group(() => {
  Route.get('images/:folder/:filename', async ({ params, response }) => {
    const folder=params.folder.split("&")
    if (folder.length > 1) {
      const filePath = Application.tmpPath(`uploads/${folder[0]}/${folder[1]}/${params.filename}`)
      return response.attachment(filePath)
    }else{
      const filePath = Application.tmpPath(`uploads/${folder[0]}/${params.filename}`)
      return response.attachment(filePath)
    }
  })
  Route.post("register", "WebApps/AuthController.register");
  Route.post("login", "WebApps/AuthController.login");
  Route.group(() => {
    Route.get("profile", "WebApps/AuthController.profile");
    Route.post("profile-update", "WebApps/AuthController.profileUpdate");
    Route.post("logout", "WebApps/AuthController.logout");
    Route.resource("users", "WebApps/UsersController",).apiOnly();
    Route.get("attr_form", "WebApps/UsersController.attr_form",);
    Route.resource("role", "WebApps/RolesController",).apiOnly();
    Route.resource("permission", "WebApps/PermissionsController",).apiOnly();
    Route.resource("dept", "WebApps/DeptsController",).apiOnly();
    Route.resource("role-permission", "WebApps/SetRolePermissionsController",).apiOnly();
    Route.resource("master-toko", "WebApps/MasterTokoController",).apiOnly();
    Route.resource("absensi", "WebApps/AbsensiController",).apiOnly();
    Route.resource("pelanggan", "WebApps/PelangganController",).apiOnly();
    Route.get("absensi-chart", "WebApps/AbsensiController.chart");
    Route.get("absensi-report", "WebApps/AbsensiController.laporan");
  }).middleware("auth:api");
}).prefix("api");
