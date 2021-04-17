/*Per la Covid Zone*/
function onJson(json) {
    console.log('JSON ricevuto');
    // Svuotiamo la lista
    console.log(json);
    const lista = document.querySelector('#sezione_covid');
    lista.innerHTML = '';
    const doc=json.All;
    console.log(doc);
  
   
    if(doc){
     // Creiamo il div che conterrà i dati
      const elenco = document.createElement('div');
      lista.appendChild(elenco);
      const confermati = doc.confirmed;
      const ricoverati = doc.recovered;
      const morti=doc.deaths;
      // Creiamo i dati
      const new_h1 = document.createElement('p');
      new_h1.textContent = 'Numero di positivi: ' + confermati;
      elenco.appendChild(new_h1);

      const new_h1_1 = document.createElement('p');
      new_h1_1.textContent = 'Numero di ricoveri: ' + ricoverati;
      elenco.appendChild(new_h1_1);
     
      const new_h1_2=document.createElement('p'); 
      new_h1_2.textContent='Numero di morti: ' + morti;
      elenco.appendChild(new_h1_2);}
    else
    {
        const new_p=document.createElement('p');
        new_p.textContent='Paese non esistente o scritto in altra lingua'; 
        lista.appendChild(new_p);    
    }
}
  
function ricercacovid(event)
{
    // Impedisci il submit del form
    event.preventDefault();
    // Leggi valore del campo di testo
    const paese_input = document.querySelector('#paese');
    const paese_value = encodeURIComponent(paese_input.value);
    // Prepara la richiesta
    rest_url = 'https://covid-api.mmediagroup.fr/v1/cases?country=' + paese_value;
    console.log('URL: ' + rest_url);
    //Esecuzione
    fetch(rest_url).then(onResponse).then(onJson, onError);
}

/*Per la Spotify Zone*/
function ricercamusica(event)
{
    // Impedisci il submit del form
    event.preventDefault();
    // Leggi valore del campo di testo

    const album_input = document.querySelector('#album');
    const album_value = encodeURIComponent(album_input.value);
    console.log('Eseguo ricerca: ' + album_value);
    // Esegui la richiesta
    fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onJson2, onError);
}

function onJson2(json) 
{
  console.log('JSON ricevuto');
  console.log(json);
  // Svuotiamo la libreria
  const library = document.querySelector('#sezione_musica');
  library.innerHTML = '';
  // Leggi il numero di risultati
  const totali = json.albums.items;
 
  let risultati = totali.length;
  // Mostriamone al massimo 6
  if(risultati > 6){
     risultati = 6;
  }
  // Processa ciascun risultato
  for(let i=0; i<risultati; i++)
  {   
    //Creiamo i div che conterranno i dati
    const album = document.createElement('div');
    library.appendChild(album);
    //Carichiamo i dati
    const album_data = totali[i];
    const title = album_data.name;
    const selected_image = album_data.images[0].url;
    const img = document.createElement('img');
    img.src = selected_image;
    const caption = document.createElement('h6');
    caption.textContent = title;
    album.appendChild(img);
    album.appendChild(caption);
  } 
}
 
function onTokenJson(json)
{
  // Imposta il token global
  token = json.access_token;
}
  
function onTokenResponse(response)
{
  return response.json();
}

/*Per la Library Zone*/
function ricercalibro(event){
  event.preventDefault(); 
  const titolo_input = document.querySelector('#libreria');
  const titolo_value = encodeURIComponent(titolo_input.value); 
  rest_url = 'http://openlibrary.org/search.json?title='+titolo_value;
  console.log('URL: ' + rest_url);
  fetch(rest_url).then(onResponse).then(onJson3, onError);
}

function onJson3(json){
  console.log(json); 
  const library = document.querySelector('#sezione_libri');
  library.innerHTML = '';
  let num_results = json.num_found;
  if(num_results > 13){
    num_results = 13;
  }
  for(let i=0; i<num_results; i++)
  {
    const new_div = document.createElement('div');
    library.appendChild(new_div);
    const doc = json.docs[i]
    const autore = doc.author_name;
    const titolo = doc.title;
    console.log(autore);
  
    const new_h6 = document.createElement('h6');
    new_h6.textContent = autore;
    new_div.appendChild(new_h6);

    const new_h6_2 = document.createElement('h6');
    new_h6_2.textContent=titolo;
    new_div.appendChild(new_h6_2);
  }
}

//Funzioni per tutti
function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function onError(error){
    console.log('Error:'+ error);
}


const client_id = '3682fe4c8799452baa29f5a5e0fdc871';
const client_secret = '';


let token;
// Login alla Dashboard personale di Spotify
fetch("https://accounts.spotify.com/api/token",
{
    method: "post",
    body: 'grant_type=client_credentials',
    headers:
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    }
}
).then(onTokenResponse).then(onTokenJson);



  // Aggiungi event listener al form
  const form = document.querySelector('#malati');
  form.addEventListener('submit', ricercacovid)

  const form2 = document.querySelector('#musica');
  form2.addEventListener('submit', ricercamusica);

  const form3 = document.querySelector('#libri');
  form3.addEventListener('submit', ricercalibro);