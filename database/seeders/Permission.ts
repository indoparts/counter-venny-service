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
        name: "create-masteroffice",
        basepermission: "masteroffice"
      },
      {
        name: "read-masteroffice",
        basepermission: "masteroffice"
      },
      {
        name: "update-masteroffice",
        basepermission: "masteroffice"
      },
      {
        name: "delete-masteroffice",
        basepermission: "masteroffice"
      },
      {
        name: "create-mastergudang",
        basepermission: "mastergudang"
      },
      {
        name: "read-mastergudang",
        basepermission: "mastergudang"
      },
      {
        name: "update-mastergudang",
        basepermission: "mastergudang"
      },
      {
        name: "delete-mastergudang",
        basepermission: "mastergudang"
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
        name: "create-izin",
        basepermission: "izin"
      },
      {
        name: "read-izin",
        basepermission: "izin"
      },
      {
        name: "update-izin",
        basepermission: "izin"
      },
      {
        name: "delete-izin",
        basepermission: "izin"
      },
      {
        name: "report-izin",
        basepermission: "izin"
      },
      {
        name: "create-lembur",
        basepermission: "lembur"
      },
      {
        name: "read-lembur",
        basepermission: "lembur"
      },
      {
        name: "update-lembur",
        basepermission: "lembur"
      },
      {
        name: "delete-lembur",
        basepermission: "lembur"
      },
      {
        name: "report-lembur",
        basepermission: "lembur"
      },
      {
        name: "create-perdin",
        basepermission: "perdin"
      },
      {
        name: "read-perdin",
        basepermission: "perdin"
      },
      {
        name: "update-perdin",
        basepermission: "perdin"
      },
      {
        name: "delete-perdin",
        basepermission: "perdin"
      },
      {
        name: "report-perdin",
        basepermission: "perdin"
      },
      {
        name: "create-reimburs",
        basepermission: "reimburs"
      },
      {
        name: "read-reimburs",
        basepermission: "reimburs"
      },
      {
        name: "update-reimburs",
        basepermission: "reimburs"
      },
      {
        name: "delete-reimburs",
        basepermission: "reimburs"
      },
      {
        name: "report-reimburs",
        basepermission: "reimburs"
      },
      {
        name: "create-jadwalgroup",
        basepermission: "jadwalgroup"
      },
      {
        name: "read-jadwalgroup",
        basepermission: "jadwalgroup"
      },
      {
        name: "update-jadwalgroup",
        basepermission: "jadwalgroup"
      },
      {
        name: "delete-jadwalgroup",
        basepermission: "jadwalgroup"
      },
      {
        name: "report-jadwalgroup",
        basepermission: "jadwalgroup"
      },
      {
        name: "create-mastergroup",
        basepermission: "mastergroup"
      },
      {
        name: "read-mastergroup",
        basepermission: "mastergroup"
      },
      {
        name: "update-mastergroup",
        basepermission: "mastergroup"
      },
      {
        name: "delete-mastergroup",
        basepermission: "mastergroup"
      },
      {
        name: "report-mastergroup",
        basepermission: "mastergroup"
      },
      {
        name: "create-usergroup",
        basepermission: "usergroup"
      },
      {
        name: "read-usergroup",
        basepermission: "usergroup"
      },
      {
        name: "update-usergroup",
        basepermission: "usergroup"
      },
      {
        name: "delete-usergroup",
        basepermission: "usergroup"
      },
      {
        name: "report-usergroup",
        basepermission: "usergroup"
      },
      {
        name: "create-timeconfig",
        basepermission: "timeconfig"
      },
      {
        name: "read-timeconfig",
        basepermission: "timeconfig"
      },
      {
        name: "update-timeconfig",
        basepermission: "timeconfig"
      },
      {
        name: "delete-timeconfig",
        basepermission: "timeconfig"
      },
      {
        name: "report-timeconfig",
        basepermission: "timeconfig"
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
    // console.log(permissionname.length);
    
    await Permission.createMany(permissionname)
  }
}
