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
    Route.resource("users", "WebApps/UsersController").apiOnly();
    Route.get("attr_form", "WebApps/UsersController.attr_form",);
    Route.get("user-approval", "WebApps/UsersController.user_approval",);
    Route.resource("role", "WebApps/RolesController").apiOnly();
    Route.resource("permission", "WebApps/PermissionsController").apiOnly();
    Route.resource("dept", "WebApps/DeptsController").apiOnly();
    Route.resource("role-permission", "WebApps/SetRolePermissionsController").apiOnly();
    Route.resource("master-toko", "WebApps/MasterTokoController").apiOnly();
    Route.resource("master-office", "WebApps/MasterOfficeController").apiOnly();
    Route.resource("master-gudang", "WebApps/MasterGudangController").apiOnly();
    Route.resource("absensi", "WebApps/AbsensiController").apiOnly();
    Route.resource("pelanggan", "WebApps/PelangganController").apiOnly();
    Route.resource("form-cuti", "WebApps/Form/CutisController").apiOnly();
    Route.put("form-cuti/approval/:id", "WebApps/Form/CutisController.approval");
    Route.get("report-cuti", "WebApps/Form/CutisController.report");
    Route.get("report-cuti-export", "WebApps/Form/CutisController.exportreport");
    Route.resource("form-izin", "WebApps/Form/IzinsController").apiOnly();
    Route.put("form-izin/approval/:id", "WebApps/Form/IzinsController.approval");
    Route.get("report-izin", "WebApps/Form/IzinsController.report");
    Route.get("report-izin-export", "WebApps/Form/IzinsController.exportreport");
    Route.resource("form-lembur", "WebApps/Form/LembursController").apiOnly();
    Route.put("form-lembur/approval/:id", "WebApps/Form/LembursController.approval");
    Route.resource("form-perdin", "WebApps/Form/PerdinsController").apiOnly();
    Route.put("form-perdin/approval/:id", "WebApps/Form/PerdinsController.approval");
    Route.resource("form-reimburs", "WebApps/Form/ReimbursController").apiOnly();
    Route.put("form-reimburs/approval/:id", "WebApps/Form/ReimbursController.approval");
    Route.resource("jadwal-group", "WebApps/Form/JadwalGroupsController").apiOnly();
    Route.resource("master-group", "WebApps/Form/MasterGroupsController").apiOnly();
    Route.resource("user-group", "WebApps/Form/UserGroupsController").apiOnly();
    Route.resource("time-config", "WebApps/Form/TimeConfigsController").apiOnly();
    Route.resource("jadwal-istirahat", "WebApps/JadwalIstirahatsController").apiOnly();
    Route.get("jadwal-istirahat-attr-form", "WebApps/JadwalIstirahatsController.attr_form");
    Route.get("report-jadwal-istirahat", "WebApps/JadwalIstirahatsController.report");
    Route.get("report-jadwal-istirahat-export", "WebApps/JadwalIstirahatsController.exportreport");
    Route.resource("master-piket", "WebApps/MasterPiketsController").apiOnly();
    Route.resource("jadwal-piket", "WebApps/UserPiketsController").apiOnly();
    Route.get("jadwal-piket-attr-form", "WebApps/UserPiketsController.attr_form");
    Route.get("report-jadwal-piket", "WebApps/UserPiketsController.report");
    Route.get("report-jadwal-piket-export", "WebApps/UserPiketsController.exportreport");

    Route.get("absensi-chart", "WebApps/AbsensiController.chart");
    Route.get("absensi-report", "WebApps/AbsensiController.laporan");

    Route.resource("variable-gaji", "WebApps/VariableGajisController").apiOnly();
    Route.resource("formula-gaji", "WebApps/FormulaGajisController").apiOnly();
  }).middleware("auth:api");
}).prefix("api");

Route.group(() => {
  Route.group(() => {
    Route.resource("piket-istirahat", "WebApps/Notification/PiketIstirahatsController").apiOnly();
    Route.resource("info", "WebApps/Notification/InfoController").apiOnly();
  }).middleware("auth:api");
}).prefix("fetch-notification");
