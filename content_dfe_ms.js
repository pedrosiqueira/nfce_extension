function download(content, filename) {
  const a = document.createElement('a') // Create "a" element
  const blob = new Blob([content], { type: "text/html" }) // Create a blob (file-like object)
  const url = URL.createObjectURL(blob) // Create an object URL from blob
  a.setAttribute('href', url) // Set "a" element link
  a.setAttribute('download', filename) // Set download filename
  a.click() // Start downloading
}

function extractfilename(doc) {
  let filename = Array.from(doc.querySelectorAll("li")).find(el => el.textContent.match("Protocolo de Autorização:")).textContent;
  let slash = filename.indexOf("/");
  let dateStr = filename.substring(slash - 2, slash + 8).split('/');
  dateStr = dateStr[2] + "-" + dateStr[1] + "-" + dateStr[0];
  let timeStr = filename.substring(slash + 9, slash + 17).replaceAll(":", "");
  let chave = doc.getElementsByClassName('chave')[0].textContent.replaceAll(" ", "");
  filename = dateStr + " " + timeStr + " " + chave + ".html";

  return filename;
}

function saveHtml(content) {
  if (!content) return false;

  let filename = extractfilename(content);

  content.querySelector("form")?.remove();
  Array.from(content.querySelectorAll("span"))
    .filter(el => el.textContent.match("click to collapse contents"))
    .forEach(element => element.remove());
  Array.from(content.querySelectorAll("h4"))
    .forEach(el => {
      if (el.querySelector("a"))
        el.innerHTML = el.querySelector("a").innerHTML
    });

  content = content.outerHTML;

  download(content, filename);

  return true;
}

window.addEventListener('load', (event) => {
  const acaopopup = document.getElementById('acaopopup');

  if (acaopopup) {
    acaopopup.addEventListener('click', async () => {
      const links = document.getElementById("links").value.trim().split('\n');

      for (const link of links) {
        try {
          const response = await fetch(link);
          const data = await response.text();

          const parser = new DOMParser();
          const html = parser.parseFromString(data, 'text/html').querySelector('#conteudo').parentElement

          if (saveHtml(html)) {
            // console.log('salvou', link);
          }
        } catch (error) {
          console.error(`Error fetching or processing ${link}:`, error);
        }
      }
    });
  } else if (saveHtml(document.getElementsByClassName('ui-content')[0])) {
    const btnNovaConsulta = Array.from(document.querySelectorAll("a.btn")).find(el => el.textContent.includes("Nova Consulta"));
    if (btnNovaConsulta)
      btnNovaConsulta.click();
  }
});