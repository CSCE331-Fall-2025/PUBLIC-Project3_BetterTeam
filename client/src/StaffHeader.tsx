import './StaffHeader.css'
import '../../server/TimeUpdate.js'//So like idk if this is the right way to do it but it does just work so
//<h1 id="PageTitle"> {page.name} </h1>
function StaffHeader() {

  return (
    <>
    <header>
        <h1 id="PageTitle"> ok </h1>
        <h1 id="Time"> TIME </h1>
        <img id="Logo" src="../assets/panda.png" height="300" width="300" title="Panda Express Logo" ></img>
    </header>
    </>
  )
}

export default StaffHeader
