export async function GET() {
  return Response.json({
    config: {
      theme: "light",
      name: process.env.CAL_NAME,
      metadata: {
        employeeId: process.env.EMPLOYEE_ID
      }
    }
  })
}