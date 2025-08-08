function download(content, filename) {
  const a = document.createElement('a') // Create "a" element
  const blob = new Blob([content], { type: "text/html" }) // Create a blob (file-like object)
  const url = URL.createObjectURL(blob) // Create an object URL from blob
  a.setAttribute('href', url) // Set "a" element link
  a.setAttribute('download', filename) // Set download filename
  a.click() // Start downloading
}

function extractfilename() {
  let filename = Array.from(document.querySelectorAll("td")).find(el => el.textContent.match("Data de Emissão")).getElementsByTagName("span")[0].textContent;
  let slash = filename.indexOf("/");
  let dateStr = filename.substring(slash - 2, slash + 8).split('/');
  dateStr = dateStr[2] + "-" + dateStr[1] + "-" + dateStr[0];
  let timeStr = filename.substring(slash + 9, slash + 17).replaceAll(":", "");
  let chave = Array.from(document.querySelectorAll("td")).find(el => el.textContent.match("Chave de Acesso")).getElementsByTagName("span")[0].textContent.replaceAll(" ", "");;
  filename = dateStr + " " + timeStr + " " + chave + ".html";

  return filename;
}

function saveHtml() {
  let content = document.getElementsByClassName('indentacaoConteudo')[1];
  content.querySelectorAll("script").forEach(el => el.remove());
  content.querySelectorAll("link").forEach(el => el.remove());
  content.querySelectorAll("label").forEach(el => el.style.display = "block");
  content.querySelectorAll("span").forEach(el => el.style.display = "block");
  content.querySelectorAll("td").forEach(el => el.style.border = "solid 1px");
  document.getElementById("botoes_nft").remove();
  document.getElementById("ctl00_ContentPlaceHolder1_divBotoesConsulta").remove();
  content = content.outerHTML;

  if (!content) return false;
  let filename = extractfilename();

  download(content, filename);

  return true;
}

window.addEventListener('load', (event) => {
  console.log("começou!");
  if (saveHtml()) {
    const btnNovaConsulta = document.getElementById("ctl00_ContentPlaceHolder1_btnVoltar");
    if (btnNovaConsulta)
      btnNovaConsulta.click();
  }
});