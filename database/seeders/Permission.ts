import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    const permissionname = [
      {
        name: "create-user",
        basepermission: "user"
      },
      {
        name: "read-user",
        basepermission: "user"
      },
      {
        name: "update-user",
        basepermission: "user"
      },
      {
        name: "delete-user",
        basepermission: "user"
      },
      {
        name: "create-role",
        basepermission: "role"
      },
      {
        name: "read-role",
        basepermission: "role"
      },
      {
        name: "update-role",
        basepermission: "role"
      },
      {
        name: "delete-role",
        basepermission: "role"
      },
      {
        name: "create-permission",
        basepermission: "permission"
      },
      {
        name: "read-permission",
        basepermission: "permission"
      },
      {
        name: "update-permission",
        basepermission: "permission"
      },
      {
        name: "delete-permission",
        basepermission: "permission"
      },
      {
        name: "create-dept",
        basepermission: "dept"
      },
      {
        name: "read-dept",
        basepermission: "dept"
      },
      {
        name: "update-dept",
        basepermission: "dept"
      },
      {
        name: "delete-dept",
        basepermission: "dept"
      },
      {
        name: "create-mastertoko",
        basepermission: "mastertoko"
      },
      {
        name: "read-mastertoko",
        basepermission: "mastertoko"
      },
      {
        name: "update-mastertoko",
        basepermission: "mastertoko"
      },
      {
        name: "delete-mastertoko",
        basepermission: "mastertoko"
      },
      {
        name: "create-masterpelanggan",
        basepermission: "masterpelanggan"
      },
      {
        name: "read-masterpelanggan",
        basepermission: "masterpelanggan"
      },
      {
        name: "update-masterpelanggan",
        basepermission: "masterpelanggan"
      },
      {
        name: "delete-masterpelanggan",
        basepermission: "masterpelanggan"
      },
      {
        name: "create-absensi",
        basepermission: "absensi"
      },
      {
        name: "read-absensi",
        basepermission: "absensi"
      },
      {
        name: "update-absensi",
        basepermission: "absensi"
      },
      {
        name: "delete-absensi",
        basepermission: "absensi"
      },
      {
        name: "report-absensi",
        basepermission: "absensi"
      },
      {
        name: "create-cuti",
        basepermission: "cuti"
      },
      {
        name: "read-cuti",
        basepermission: "cuti"
      },
      {
        name: "update-cuti",
        basepermission: "cuti"
      },
      {
        name: "delete-cuti",
        basepermission: "cuti"
      },
      {
        name: "report-cuti",
        basepermission: "cuti"
      },
      {
        name: "create-izinsakit",
        basepermission: "izinsakit"
      },
      {
        name: "read-izinsakit",
        basepermission: "izinsakit"
      },
      {
        name: "update-izinsakit",
        basepermission: "izinsakit"
      },
      {
        name: "delete-izinsakit",
        basepermission: "izinsakit"
      },
      {
        name: "report-izinsakit",
        basepermission: "izinsakit"
      },
      {
        name: "create-izinpribadi",
        basepermission: "izinpribadi"
      },
      {
        name: "read-izinpribadi",
        basepermission: "izinpribadi"
      },
      {
        name: "update-izinpribadi",
        basepermission: "izinpribadi"
      },
      {
        name: "delete-izinpribadi",
        basepermission: "izinpribadi"
      },
      {
        name: "report-izinpribadi",
        basepermission: "izinpribadi"
      },
      {
        name: "create-jadwalistirahat",
        basepermission: "jadwalistirahat"
      },
      {
        name: "read-jadwalistirahat",
        basepermission: "jadwalistirahat"
      },
      {
        name: "update-jadwalistirahat",
        basepermission: "jadwalistirahat"
      },
      {
        name: "delete-jadwalistirahat",
        basepermission: "jadwalistirahat"
      },
      {
        name: "report-jadwalistirahat",
        basepermission: "jadwalistirahat"
      },
      {
        name: "create-jadwalpiket",
        basepermission: "jadwalpiket"
      },
      {
        name: "read-jadwalpiket",
        basepermission: "jadwalpiket"
      },
      {
        name: "update-jadwalpiket",
        basepermission: "jadwalpiket"
      },
      {
        name: "delete-jadwalpiket",
        basepermission: "jadwalpiket"
      },
      {
        name: "report-jadwalpiket",
        basepermission: "jadwalpiket"
      },
      {
        name: "create-gaji",
        basepermission: "gaji"
      },
      {
        name: "read-gaji",
        basepermission: "gaji"
      },
      {
        name: "update-gaji",
        basepermission: "gaji"
      },
      {
        name: "delete-gaji",
        basepermission: "gaji"
      },
      {
        name: "report-gaji",
        basepermission: "gaji"
      },
      {
        name: "create-kasbon",
        basepermission: "kasbon"
      },
      {
        name: "read-kasbon",
        basepermission: "kasbon"
      },
      {
        name: "update-kasbon",
        basepermission: "kasbon"
      },
      {
        name: "delete-kasbon",
        basepermission: "kasbon"
      },
      {
        name: "report-kasbon",
        basepermission: "kasbon"
      },
    ]
    await Permission.createMany(permissionname)
  }
}
