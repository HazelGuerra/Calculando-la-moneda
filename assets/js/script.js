let apiUrl = "https://mindicador.cl/api/";
let codigoMonedas = ["dolar", "euro"];
let grafico;

let inputMontoPesos = document.querySelector("#montoPesos");
let selectMonedaCambio = document.querySelector("#monedaCambio");
let parrafoMensaje = document.querySelector("#mensaje");
let botonBuscar = document.querySelector("#botonBuscar");
let myChart = document.querySelector("#myChart");

function printMensaje(mensaje, tipo) {
    parrafoMensaje.innerHTML = mensaje;
    parrafoMensaje.classList.add(tipo);
  }

  //grafico
  function renderGrafico(moneda) {
    let serie10Ultimos = moneda.serie.slice(0, 10);

    const labels = serie10Ultimos
      .map((serie) => serie.fecha.slice(0, 10))
      .reverse();
    const data = serie10Ultimos.map((serie) => serie.valor);
    const datasets = [
      {
        label: "Historial ultimos 10 dias",
        borderColor: "pink",
        data,
      },
    ];

    const conf = {
      type: "line",
      data: {
        labels,
        datasets,
      },
    };
    myChart.innerHTML = "";

    if (grafico) {
      grafico.destroy();
    }

    grafico = new Chart(myChart, conf);

    console.log("hola");
  }

renderSelect();

botonBuscar.addEventListener("click", async function () {
  let monedaCambio = selectMonedaCambio.value;
  let montoPesos = inputMontoPesos.value;

  if (monedaCambio === "") {
    printMensaje("Debe seleccionar una moneda", "error");
    return;
  }

  let url = `${apiUrl}${monedaCambio}`;

  let respuesta = await fetch(url);
  let datos = await respuesta.json();
  let valorMoneda = datos.serie[0].valor;
  let resultado = montoPesos / valorMoneda;

  printMensaje(`tu cambio  es ${resultado}`, "ok");

  renderGrafico(datos);
});

//imput moneda
async function renderSelect() {
  let monedas = await getMonedas(codigoMonedas);
  let html = "";

  console.log(monedas);
  for (const moneda of monedas) {
    let template = `
            <option value="${moneda.codigo}">${moneda.nombre}</option>
        `;
    html += template;
  }
  selectMonedaCambio.innerHTML += html;
}

async function getMonedas(arrayCodigos) {
  let monedas = [];

  for (const element of arrayCodigos) {
    let moneda = await getMoneda(element);
    monedas.push(moneda);
  }
  return monedas;
}

async function getMoneda(codigo) {
  try {
    const res = await fetch(apiUrl + codigo);
    const moneda = await res.json();
    return moneda;
  } catch (error) {
    printMensaje("Se produjo un error en la consulta", "error");
    console.log(error);
  }
}
