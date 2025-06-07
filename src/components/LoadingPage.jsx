import "../css/loadingPage.css";

function LoadingPage() {
  //pagina de cargando entre el login y main
  return (
    <div className="loadContainer">
        <div className="ring"></div>
        <div className="text">loading</div>
    </div>
  )
}

export default LoadingPage