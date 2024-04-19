import '../../css/LogOut.css'; // Import CSS file

const LoggedOut = () => { 
  return (
    <div className="logout">
      <div className="page-title">
        <h2>Logged Out!</h2>
      </div>
        <img className="logout-img" src="codeninjas_bye.png" alt="Code Ninjas Bye" />
    </div>
  )
}

export default LoggedOut
