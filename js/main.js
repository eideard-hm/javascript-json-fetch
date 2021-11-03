const selectListPaises = document.querySelector("#txtCiudad");
const bodyTableResult = document.querySelector("#result-pais");
const pResult = document.querySelector("#p-result");
const alertErrorEmpty = document.querySelector("#alert-error");
const tableResult = document.querySelector("#table-result");

let arrPlatos = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadListPaises();
  tableResult.style.display = "none";
  if (selectListPaises.value === "") {
    alertErrorEmpty.innerHTML = `
      <div class="alert alert-info" role="alert">
          No se ha seleccionado un pais.
      </div>
    `;
  } else {
    alertErrorEmpty.innerHTML = "";
  }
});

const loadListPaises = async () => {
  const url = "listadoPaises.json";

  try {
    const req = await fetch(url);
    const {
      listadoPaises: { pais },
    } = await req.json();
    selectListPaises.innerHTML =
      '<option value="" disabled selected>-- Seleccione un país --</option>';
    pais.forEach((pais) => {
      selectListPaises.innerHTML += `
                <option value="${pais["nombre"]}">${pais["nombre"]}</option>
            `;
    });
  } catch (error) {
    console.error(error);
  }
};

const resultCountrySelected = async (e) => {
  if (selectListPaises.value === "") {
    alertErrorEmpty.innerHTML = `
      <div class="alert alert-info" role="alert">
          No se ha seleccionado un pais.
      </div>
    `;
  } else {
    alertErrorEmpty.innerHTML = "";
  }
  const url = "listadoPaises.json";
  const paisSelected = e.target.value;
  if (paisSelected === null || paisSelected.trim() === "") {
    alertErrorEmpty.innerHTML = `
            <div class="alert alert-danger" role="alert">
                No se ha seleccionado un pais valido. Por favor intente nuevamente !!
            </div>
        `;
  } else {
    try {
      const req = await fetch(url);
      const {
        listadoPaises: { pais },
      } = await req.json();
      const result = pais.find((pais) => pais.nombre === paisSelected);
      if (result !== null || result !== "") {
        bodyTableResult.innerHTML = "";
        pResult.innerHTML = `
                El resultado de la petición para el país: <b>${paisSelected}</b> es:
         `;
        tableResult.style.display = "block";
        bodyTableResult.innerHTML += `
            <tr>
                <th>${result["nombre"]}</th>
                <td>${result["capital"]}</td>
                <td>${result["textoCapital"]}</td>
                <td>
                    <ul class="ul">
                         ${result.ciudadImportante
                           .map(
                             (city) =>
                               `<li><a href="https://www.google.com/search?q=${city}" target="_blank">${city}</a></li>
                              ${platosTipicos(city)
                                .then((platoTipico) => {
                                  document.querySelector(
                                    ".ul"
                                  ).innerHTML += `<li>${platoTipico}</li>`;
                                })
                                .catch((error) => {
                                  console.log(error);
                                })}
                               `
                           )
                           .join("")}
                    </ul>
                </td>
            </tr>
        `;
      } else {
        pResult.innerHTML = `
                    No se ha encontrado ninguna coincidencia con el paise seleccionado: <b>${paisSelected}</b>
                `;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const platosTipicos = async (city) => {
  const url = "platosPaises.json";
  try {
    const req = await fetch(url);
    const { platoTipico } = await req.json();
    const plato = platoTipico
      .map((plato) => {
        if (plato.ciudad === city) {
          return `<img src="${plato.imagen}" alt="${plato.nombre}" width="100" height="100" />`;
        }
      })
      .join("");
    return plato;
  } catch (error) {
    console.log(error);
  }
};

selectListPaises.addEventListener("input", resultCountrySelected);
// selectListPaises.addEventListener("input", resultCountrySelected);
