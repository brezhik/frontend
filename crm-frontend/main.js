const body = document.querySelector('.body');
const state = {
    clients: [],
    sortType: null,
    sortDirection: { nameDirection: true, idDirection: true, createdDirection: true, updatedDirection: true }
}
let timeoutId;
//переменная введена для того, чтобы если вводить адрес с hash частью сразу в 
//браузер не появлялся второй спиннер на кнопке, появлялся только основной спиннер при загрузке приложения
let btnLoadFlag = false;

//создаем header
function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    const logo = document.createElement('a');
    logo.classList.add('logo');
    const searchForm = document.createElement('form');
    searchForm.classList.add('search-form');
    const logoImg = document.createElement('img');
    logoImg.src = 'img/logo.svg';
    logoImg.classList.add('logo-img');
    const input = document.createElement('input');
    input.placeholder = 'Введите запрос';
    input.classList.add('search-input');
    input.addEventListener('input', () => {
        search(input.value);
    })
    logo.append(logoImg);
    searchForm.append(input);
    header.append(logo);
    header.append(searchForm);
    return { header, searchForm }
}

//создаем container
function createContainer() {
    const container = document.createElement('div');
    container.classList.add('container');
    const mainHeading = document.createElement('h1');
    mainHeading.classList.add('main-heading');
    mainHeading.textContent = 'Клиенты';
    container.append(mainHeading);
    return container;
}

//создаем заголовок таблицы
function createTableHeader() {
    const tableHeaders = [{ name: 'ID', class: 'cell-id' }, { name: 'Фамилия Имя Отчество', class: 'cell-surname' }, { name: 'Дата и время создания', class: 'cell-created' }, { name: 'Последние изменения', class: 'cell-updated' }, { name: 'Контакты', class: 'cell-contacts' }, { name: 'Действия', class: 'cell-actions' }];
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    table.classList.add('table');
    const headerRow = document.createElement('tr');
    tableHeaders.forEach(el => {
        const cell = document.createElement('th');
        cell.classList.add(el.class);
        const cellContent = document.createElement('span');
        cellContent.classList.add('table-header-content');
        cellContent.textContent = el.name;
        cell.append(cellContent)
        headerRow.append(cell);

    })
    thead.append(headerRow);
    table.append(thead);
    return { table, thead };
}

//создаем тело таблицы
function createTableBody(clientList) {
    const tbody = document.createElement('tbody');
    tbody.classList.add('table-body');
    for (let i = 0; i < clientList.length; i++) {
        const row = createRow(clientList[i]);
        tbody.append(row);
    }
    return tbody;
}

// функция создания ряда таблицы
function createRow(client) {
  const row = document.createElement('tr');
  row.classList.add('table-row');
  const cellId = createCell(client.id)
  row.append(cellId);
  cellId.classList.add('table-cell-id');
  const fullName = createLinkCell(client.surname + " " + client.name + " " + client.lastName);
  fullName.getElementsByTagName('a')[0].href = `index.html#${client.id}`
  row.append(fullName);
  let createdAtCell = createDateCell(client.createdAt);
  row.append(createdAtCell);
  let updatedAtCell = createDateCell(client.updatedAt);
  row.append(updatedAtCell);
  const contacts = client.contacts;
  const contactCell = createContactCell(contacts);
  row.append(contactCell);
  const actionCell = createActionCell();
  row.append(actionCell);
  return row;
}

//функция создания стандартной ячейки
function createCell(data) {
    const cell = document.createElement('td');
    cell.classList.add('table-cell');
    cell.textContent = data;
    return cell;
}

//функция создания ячейки со ссылкой
function createLinkCell(data) {
    const cell = document.createElement('td');
    const link = document.createElement('a');
    cell.classList.add('table-cell');
    link.textContent = data;
    cell.append(link);
    return cell;
}

// функция создания ячейки с датой и временем (меняем формат данных и разбиваем на 2 элемента span в целях стилизации)
function createDateCell(data) {
    let parseDate = new Date(data);
    let date = formatDate(parseDate);
    let dateSpan = document.createElement('span');
    dateSpan.classList.add('client-dateinfo');
    dateSpan.textContent = date;
    let time = formatTime(parseDate);
    let timeSpan = document.createElement('span');
    timeSpan.classList.add('client-timeinfo');
    timeSpan.textContent = time;
    const dateCell = document.createElement('td');
    dateCell.classList.add('table-cell');
    dateCell.append(dateSpan);
    dateCell.append(timeSpan);
    return dateCell;
}

function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

function formatTime(date) {
    let hh = date.getHours();
    if (hh < 10) hh = '0' + hh;

    let mm = date.getMinutes();
    if (mm < 10) mm = '0' + mm;

    return hh + ':' + mm;
}

//функция создания ячейки с сонтактами
function createContactCell(contacts) {
    let contactLinks = [];
    contacts.forEach(el => {
        let contactLink = document.createElement('a');
        let contactSpan = document.createElement('span');
        contactSpan.classList.add('contacts-content');
        contactLink.setAttribute('data-type', `${el.type}`);
        contactLink.classList.add('contact-link');
        contactSpan.textContent = el.value;
        createContactLink(el.type, el.value, contactLink);
        contactLink.append(contactSpan);
        contactLinks.push(contactLink);
        contactLink.addEventListener('mouseover', () => {
            contactSpan.classList.add('visible');
        })
        contactLink.addEventListener('mouseout', () => {
            contactSpan.classList.remove('visible');
        })
    })
    let contactCell = createCell('');
    contactCell.classList.add('table-cell-contacts');
    contactLinks.forEach(el => {
        contactCell.append(el);
    })
    if (contactLinks.length > 4) {
        let moreBtn = document.createElement('button');
        moreBtn.classList.add('more-btn');
        const number = contactLinks.length - 4;
        moreBtn.textContent = `+ ${number}`;
        contactCell.append(moreBtn);
        moreBtn.addEventListener('click', () => {
            contactLinks.forEach(el => el.style.display = "inline-block");
            moreBtn.remove();
        })
    }
    return contactCell;
}

// назначаем ссылкам с контактами href
function createContactLink(type, value, link) {
  if (type == 'Телефон') {
     link.href = `tel:${value}`
 }
 else if (type == 'Email') {
     link.href = `mailto:${value}`
 } else {
     link.href = value;
 }
}

// функция создания ячейки с кнопками
function createActionCell() {
    const container = document.querySelector('.container');
    const cell = document.createElement('td');
    cell.classList.add('table-actioncell');
    cell.classList.add('table-cell');
    const btnChange = document.createElement('button');
    btnChange.classList.add('btn-change');
    btnChange.textContent = 'Изменить'
    btnChange.addEventListener('click', async (e) => {
        const table = document.querySelector('.table');
        const row = btnChange.parentNode.parentNode.rowIndex;
        const id = table.rows[row].cells[0].textContent;
        changeHash(id);
        btnLoadFlag = true;
    })
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.textContent = 'Удалить'
    btnDelete.addEventListener('click', async (e) => {
        const table = document.querySelector('.table');
        const row = btnChange.parentNode.parentNode.rowIndex;
        const id = table.rows[row].cells[0].textContent;
        const spinner = renderSpinner(9, 9, 7, 2, '0 0 20 20');
        const btn = table.rows[row].cells[5].children[1];
        btn.append(spinner);
        spinner.classList.add('btn-spinner');
        btn.classList.add('btn-load');
        spinner.classList.add('btn-delete-spinner');
        setTimeout(function () {
          const deleteModal = createDeleteModal(id, state.clients);
          body.append(deleteModal);
            spinner.remove();
            btn.classList.remove('btn-load');
        }, 500)
    });
    cell.append(btnChange);
    cell.append(btnDelete);
    return cell;
}

// создание кнопки добавления клиента
function createButton() {
    const addButton = document.createElement('button');
    addButton.textContent = 'Добавить клиента';
    addButton.classList.add('add-btn');
    return addButton;
}

//функции сортировки таблицы

//обновляем тело таблицы
function updateTableBody(clientlist) {
  const oldTableBody = document.querySelector('.table-body');
  oldTableBody.remove();
  const tableBody = (createTableBody(clientlist));
  return tableBody;
}

// сохраняем выбранную сортировку после изменения таблицы
function saveSortDirection(sortType) {
  switch (sortType) {
      case 'nameType':
          state.sortDirection.nameDirection = !state.sortDirection.nameDirection;
          break;
      case 'idType':
          state.sortDirection.idDirection = !state.sortDirection.idDirection;
          break;
      case 'createdType':
          state.sortDirection.createdDirection = !state.sortDirection.createdDirection;
          break;
      case 'updatedType':
          state.sortDirection.updatedDirection = !state.sortDirection.updatedDirection;
          break;
      default:
          state.sortDirection.idDirection = true;
          break;
  }
}

// отрисовываем отсортированную таблицу
function renderSortedTable(sortType) {
  switch (sortType) {
      case 'nameType':
          sortString();
          break;
      case 'idType':
          sortId();
          break;
      case 'createdType':
          sortDate('createdAt');
          break;
      case 'updatedType':
          sortDate('updatedAt');
          break;
      default:
          state.sortDirection.idDirection = true;
          sortId();
          break;
  }
  const table = document.querySelector('.table')
  const tbody = updateTableBody(state.clients);
  table.append(tbody);
}

// функция сортировки по id
function sortId() {
  const container = document.querySelector('.container');
  const cell = document.querySelector('.cell-id');
  if (state.sortDirection.idDirection) {
      state.clients.sort((a, b) => Number(a.id) - Number(b.id));
      state.sortDirection.idDirection = false;
      cell.classList.add('ascending');
   }
  else {
      state.clients.sort((a, b) => Number(b.id) - Number(a.id));
      state.sortDirection.idDirection = true;
      cell.classList.add('descending');
  }
}

//функция сортировки по фамилии
function sortString() {
  const cell = document.querySelector('.cell-surname');
  state.sortType = 'nameType';
  if (state.sortDirection.nameDirection) {
      state.clients.sort((a, b) => a.surname > b.surname ? 1 : -1);
      state.sortDirection.nameDirection = false;
      cell.classList.add('ascending');
      cell.classList.add('asc-alphabet');
  }
  else {
      state.clients.sort((a, b) => a.surname < b.surname ? 1 : -1);
      state.sortDirection.nameDirection = true;
      cell.classList.add('descending');
      cell.classList.add('desc-alphabet');
  }
}

//функция сортировки по дате
function sortDate(data) {
  let cell;
  let direction;
  if (data == 'createdAt') {
      state.sortType = 'createdType';
      cell = document.querySelector('.cell-created');
      direction = 'createdDirection';

  } else {
      state.sortType = 'updatedType';
      cell = document.querySelector('.cell-updated');
      direction = 'updatedDirection';
  }

  if (state.sortDirection[direction]) {
      state.clients.sort((a, b) => (a[data]) > (b[data]) ? 1 : -1);
      state.sortDirection[direction] = false;
      cell.classList.add('ascending');
  }
  else {
      state.clients.sort((a, b) => (a[data]) < (b[data]) ? 1 : -1);;
      state.sortDirection[direction] = true;
      cell.classList.add('descending');
  }
}

//функция удаления стрелок направления сортировки при клике на заголовок
function removeSortArrows() {
  const ascArrows = document.querySelectorAll('.ascending');
  const descArrows = document.querySelectorAll('.descending');
  ascArrows.forEach(item => item.classList.remove('ascending'));
  descArrows.forEach(item => item.classList.remove('descending'));
  const ascAlphabet = document.querySelectorAll('.asc-alphabet');
  const descAlphabet = document.querySelectorAll('.desc-alphabet');
  ascAlphabet.forEach(item => item.classList.remove('asc-alphabet'));
  descAlphabet.forEach(item => item.classList.remove('desc-alphabet'));
}

//навешиваем события сортировки на заголовки таблицы
function sortTable() {
  const thName = document.querySelector('.cell-surname');
  thName.addEventListener('click', () => {
      state.sortType = 'nameType';
      removeSortArrows();
      renderSortedTable('nameType');
  });
  const thId = document.querySelector('.cell-id');
  thId.addEventListener('click', () => {
      state.sortType = 'idType';
      removeSortArrows();
      renderSortedTable('idType');
  });
  thCreated = document.querySelector('.cell-created');
  thCreated.addEventListener('click', () => {
      state.sortType = 'createdType';
      removeSortArrows();
      renderSortedTable('createdType');
  });
  thUpdated = document.querySelector('.cell-updated');
  thUpdated.addEventListener('click', () => {
      state.sortType = 'updatedType';
      removeSortArrows();
      renderSortedTable('updatedType');
  });
}

//поиск с автодополнением

//осуществление поиска через 300мс после ввода
function search(string) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(autocomplete, 300, string);
}

//функция автодополнения
async function autocomplete(string) {
  const div = document.querySelector('.autocomplete-list');
  if(div) {div.remove()};
  const selectedRow = document.querySelector('.selected-row');
  if(selectedRow) {
      selectedRow.classList.remove('selected-row');
  }
  const input = document.querySelector('.search-input');
  if(input.value){
      const spinner = renderSpinner(12, 12, 10, 4, '0 0 50 50');
      spinner.classList.add('spinner');
      spinner.classList.add('search-spinner');
      body.append(spinner);
      const list = document.createElement('div');
      list.classList.add('autocomplete-list');
      const ul = document.createElement('ul');
      ul.classList.add('list-ul');
      list.append(ul);
      const clientsFound = await findClient(string);
      setTimeout(function () {
        spinner.remove();
        const header = document.querySelector('.header');
        if(ul.childNodes.length) {
        header.append(list);
      }        
  }, 500)
  for(let i =0; i < clientsFound.length; i++){
      if(clientsFound[i].surname.includes(string) || clientsFound[i].name.includes(string) ){
          let listItem = document.createElement('li');
          let link = document.createElement('a');
          listItem.append(link);
          link.classList.add('autocomplete-link');
          link.innerHTML = `${clientsFound[i].name} ${clientsFound[i].surname}` ;
          link.onclick = function() {
              input.value = this.innerHTML;
              let table = document.querySelector('.table');
              for(let j= 0; j < table.rows.length; j++ ) {
                  if(table.rows[j].cells[0].textContent == clientsFound[i].id){
                      table.rows[j].classList.add('selected-row');
                      table.rows[j].id = 'selectedRow';
                      let destination = document.getElementById('selectedRow');
                      destination.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                      });
                      table.rows[j].removeAttribute('id');
                      list.innerHTML = '';
                      list.style.display = 'none';
                      break;
                  }
              }
          }
          ul.appendChild(listItem);
          arrowNavigation(ul);
        }
  }
}
}

// навешиваем события на стрелки навигации и Enter в блоке автодополнения
function arrowNavigation (ul) {
let liSelected;
let index = -1;

document.addEventListener('keydown', function(event) {
let len = ul.getElementsByTagName('li').length-1;

  if(event.keyCode === 40) {
      index++;
        //down 
        if (liSelected) {
                  liSelected.classList.remove('selected');
            next = ul.getElementsByTagName('li')[index];
            if(typeof next !== undefined && index <= len) {
            
                      liSelected = next;
                  } else {
                       index = 0;
                       liSelected = ul.getElementsByTagName('li')[0];
                  }
                  liSelected.classList.add('selected')
            
          }
          else {
          index = 0;
          
              liSelected = ul.getElementsByTagName('li')[0];
              liSelected.classList.add('selected')
          }
        }
        else if (event.keyCode === 38) {
        
        //up
          if (liSelected) {
                  liSelected.classList.remove('selected');
            index--;
           
            next = ul.getElementsByTagName('li')[index];
            if(typeof next !== undefined && index >= 0) {
                      liSelected = next;
                  } else {
                          index = len;
                       liSelected = ul.getElementsByTagName('li')[len];
                  }
                  liSelected.classList.add('selected')
          }
          else {
          index = 0;
              liSelected = ul.getElementsByTagName('li')[len];
                  liSelected.classList.add('selected')
          }
        }
         else if (event.keyCode === 13) {
          event.preventDefault(); 
          liSelected = document.querySelector('.selected');
      
         
          if(liSelected) {
              liSelected.children[0].click();
          }
          
         
        }
      }, false);
}

// работа с сервером

// функция получения списка всех клиентов
async function loadClientList() {
    const response = await fetch(`http://localhost:3000/api/clients`);
    const data = await response.json();
    return data;
}

// функция изменения инфомации о клиенте
async function changeClientInfo(id, client) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: client.name,
            surname: client.surname,
            lastName: client.lastName,
            contacts: client.contacts
        })
    })
    const data = await response.json();
    return {
        data,
        status: response.status,
    }
}

//функция получения информации о клиенте по id
async function getClientInfo(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
}

// функция удаления клиента
async function deleteClient(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
    })
    const data = await response.json();
    return data;
}

//функция сохранения нового клиента
async function saveClient(client) {
  const response = await fetch(`http://localhost:3000/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          name: client.name,
          surname: client.surname,
          lastName: client.lastName,
          contacts: client.contacts
      })
  })
  const data = await response.json();
  return {
      data,
      status: response.status,
  }
}

//функция поиска клиента
async function findClient(string) {
  const response = await fetch(`http://localhost:3000/api/clients?search=${string}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
}

// функции проверки получения статуса ответа от сервера
function doSave(clientList, data, id = null) {
  clientList.push(data);
}

function doChange(clientList, data, id) {
  let index = clientList.findIndex(el => el.id === id);
  clientList.splice(index, 1, data);
}

function checkErrors(status, data, modal, error, form, clientList, id, doIfSuccess) {
  switch (status) {
      case 200:
      case 201:
          setTimeout(function () {
              const spinner = document.querySelector('.save-btn-spinner');
              const block = document.querySelector('.spinner-wrapper');
              spinner.remove();
              block.remove();
              doIfSuccess(clientList, data, id);
              closeModal(modal);
              saveSortDirection(state.sortType);
              renderSortedTable(state.sortType);
          }, 500)
          break;
      case 404:
          error.textContent = "Пользователь не найден"
          break;
      case 422:

          const errors = data.errors;
          errors.forEach(er => {
              error.textContent += `${er.message}!`;
          })

          errors.forEach(er => {
              const formArray = Array.from(form.children);
              const errorField = formArray.filter(el => el.name == er.field);
              errorField[0].classList.add('error-field');
              errorField[0].addEventListener('focus', () => {
                  errorField[0].classList.remove('error-field');
              })
          });
          break;
      case 500:
          error.textContent = "Странно, но сервер сломался"
          break;
      default: error.textContent = "Что-то пошло не так";
  }
}

// работа с модальными окнами

//функция создания модального окна добавления и изменения клиента
async function createAddModal(clientList, type, id) {
  const container = document.querySelector('.container');
  const modal = document.createElement('div');
  modal.classList.add('modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  const wrapper = document.createElement('div');
  wrapper.classList.add('modal-wrapper');
  const modalHeading = document.createElement('h2');
  modalHeading.classList.add('modal-heading');
  const idSpan = document.createElement('span');
  idSpan.classList.add('id-span');
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.addEventListener('click', () => {
      closeModal(modal);

  })
  const form = document.createElement('form');
  form.classList.add('add-form');
  const fieldSet = document.createElement('fieldset');
  fieldSet.classList.add('name-fieldset');
  const familiyNameInput = createModalInput('Фамилия');
  familiyNameInput.name = "surname";
  const familyNameLabel = createLabel('Фамилия');
  const nameInput = createModalInput('Имя');
  nameInput.name = "name";
  const nameLabel = createLabel('Имя');
  const middleNameInput = createModalInput('Отчество');
  middleNameInput.name = "middleName";
  const middleNameLabel = createLabel('Отчество');
  fieldSet.append(familyNameLabel);
  fieldSet.append(familiyNameInput);
  fieldSet.append(nameLabel);
  fieldSet.append(nameInput);
  fieldSet.append(middleNameLabel);
  fieldSet.append(middleNameInput);
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('modal-contacts-wrapper');
  const contactModal = document.createElement('fieldset');
  contactModal.classList.add('modal-contacts');
  const error = document.createElement('div');
  error.classList.add('error');

  if (type == 'create') {
      modalHeading.textContent = "Новый клиент";
      familyNameLabel.style.display = "none";
      nameLabel.style.display = "none";
      middleNameLabel.style.display = "none";

  } else {
      modalHeading.textContent = "Изменить клиента";
      const editClient = await getClientInfo(id);
      familiyNameInput.value = editClient.surname;
      nameInput.value = editClient.name;
      middleNameInput.value = editClient.lastName;
      if (editClient.contacts.length > 0) {
          for (let i = 0; i < editClient.contacts.length; i++) {
              const contactForm = createContactForm();
              let select = contactForm.elements.select;
              for (let j = 0; j < select.length; j++) {
                  if (select[j].textContent === editClient.contacts[i].type) select[j].selected = true;
              }
              contactForm.elements.contactInput.value = editClient.contacts[i].value;
              contactModal.append(contactForm);

          }

      }
  }
  const addButton = createAddBtn();
  addButton.addEventListener('click', (e) => {
      e.preventDefault();
      const contacts = document.querySelectorAll('.contact-wrapper');
      
      if (contacts.length < 9) {
          const contactForm = createContactForm();
          contactModal.append(contactForm);
      } else {
          const contactForm = createContactForm();
          contactModal.append(contactForm);
          addButton.remove();
      }

  })
  const saveButton = createSaveBtn();

  const cancelButton = createCancelBtn();
  cancelButton.addEventListener('click', () => {
      closeModal(modal);
  })

  const deleteBtn = createDeleteBtn();
  deleteBtn.addEventListener('click', async (e) => {
      closeModal(modal);
      const deleteModal = createDeleteModal(id, clientList);
      body.append(deleteModal);
  })


  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.textContent = " ";
      const contacts = [];
      const forms = document.querySelectorAll('.contact-wrapper');
      forms.forEach(item => {
          const input = item.getElementsByClassName('contact-input')[0];
          const select = item.getElementsByClassName('contact-select')[0];
          let indexSelected = select.selectedIndex;
          let option = select.querySelectorAll('option')[indexSelected];
        
          if (input.value) {
              let obj = { type: option.textContent, value: input.value };
              contacts.push(obj);
          } else {
              error.textContent += "Контакт не заполнен! ";
              input.classList.add('error-field');
              input.addEventListener('focus', () => {
                  input.classList.remove('error-field');
              })

          }

      })

      validateName(error);

      const client = { name: form.elements.name.value, surname: form.elements.surname.value, lastName: form.elements.middleName.value, contacts };
      if (checkContacts() && checkName()) {
          const spinner = renderSpinner(9, 9, 7, 2, '0 0 20 20');
          const form = document.querySelector('.add-form');
          form.append(spinner);
          spinner.classList.add('save-btn-spinner');
          const block = createBlock();
          body.append(block);
          if (type == "create") {
              const { data, status } = await saveClient(client);
                  checkErrors(status, data, modal, error, form, clientList, id = null, doSave);
                 
              } else {
              const { data, status } = await changeClientInfo(id, client);
                  checkErrors(status, data, modal, error, form, clientList, id, doChange);
                  
              }
      }
  })
  form.append(fieldSet);
  contactWrapper.append(contactModal);
  contactWrapper.append(addButton);
  form.append(contactWrapper);
  form.append(error);
  form.append(saveButton);
  wrapper.append(modalHeading);
  wrapper.append(idSpan);
  wrapper.append(closeBtn);
  modalContent.append(wrapper);
  modalContent.append(form);
  modal.append(modalContent);
  if (type == "create") {
      modalContent.append(cancelButton);
  } else {
      modalContent.append(deleteBtn);
  }
  window.onclick = function (event) {
      if (event.target == modal) {
          closeModal(modal);
      }

  }
  return modal;
}

// функция создания модального окна удаления клиента
function createDeleteModal(id, clientList) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  const deleteModal = document.createElement('div');
  deleteModal.classList.add('delete-modal');
  const modalHeading = document.createElement('h2');
  modalHeading.classList.add('modal-heading');
  modalHeading.classList.add('delete-modal-heading');
  modalHeading.textContent = "Удалить клиента";
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.addEventListener('click', () => {
      closeModal(modal);

  })
  const modalText = document.createElement('p');
  modalText.classList.add('modal-text');
  modalText.textContent = "Вы действительно хоитите удалить данного клиента?"
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('save-btn');
  deleteBtn.textContent = "Удалить";
     deleteBtn.addEventListener('click', async (e) => {
      await deleteClient(id);
      let index = clientList.findIndex(el => el.id === id);
      clientList.splice(index, 1);
      
     
      saveSortDirection(state.sortType);
      renderSortedTable(state.sortType);
      modal.remove();
  })
  const cancelButton = createCancelBtn();
  cancelButton.addEventListener('click', () => {
      modal.remove();
  })
  deleteModal.append(modalHeading);
  deleteModal.append(closeBtn);
  deleteModal.append(modalText);
  deleteModal.append(deleteBtn);
  deleteModal.append(cancelButton);
  modal.append(deleteModal);
  window.onclick = function (event) {
      if (event.target == modal) {
          closeModal(modal);
      }
  }
  return modal;
}

//функция закрытия модального окна
function closeModal(modal) {
  modal.remove();
  history.pushState("", document.title, window.location.pathname);
}

// создание элементов модальнго окна

function createModalInput(placeholder) {
    const input = document.createElement('input');
   
    if(placeholder == 'Отчество') {
        input.placeholder = placeholder;
    } else {
        input.placeholder = `${placeholder}*`;
    }
    input.id = placeholder;
    input.classList.add('modal-input');
    return input;
}

function createLabel(placeholder) {
    const label = document.createElement('label');
    label.classList.add('modal-label');
    if(placeholder == 'Отчество') {
        label.textContent = placeholder;
    } else {
        label.textContent = `${placeholder}*`;
    }

    label.setAttribute('for', placeholder);
    return label;
}

function createAddBtn() {
    const addButton = document.createElement('button');
    addButton.textContent = "Добавить контакт";
    addButton.classList.add('add-contact-btn');
    return addButton;
}

function createSaveBtn() {
    const saveButton = document.createElement('button');
    saveButton.textContent = "Сохранить";
    saveButton.classList.add('save-btn');
    saveButton.type = "submit";
    return saveButton;
}

function createCancelBtn() {
    const cancelButton = document.createElement('a');
    cancelButton.textContent = "Отмена";
    cancelButton.classList.add('cancel-btn');
    return cancelButton;
}

function createDeleteBtn() {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Удалить клиента";
    deleteButton.classList.add('delete-btn');
    return deleteButton;
}

function createContactForm() {
  const contactForm = document.createElement('form');
  contactForm.classList.add('contact-wrapper');
  const select = document.createElement('select');
  select.classList.add('contact-select');
  select.name = "select";
 
 
  select.addEventListener('click' , function(){
      select.parentElement.classList.toggle('select-open');
  })
  select.addEventListener('blur' , function(){
      select.parentElement.classList.remove('select-open');
  })
  select.addEventListener('change' , function(){
      select.parentElement.classList.remove('select-open');
  })
  const tel = document.createElement('option');
  tel.textContent = "Телефон";
  tel.style.marginBottom = '15px'
  const additionTel = document.createElement('option');
  additionTel.textContent = "Доп.телефон";
  const email = document.createElement('option');
  email.textContent = "Email";
  const vk = document.createElement('option');
  vk.textContent = "Vk";
  const fb = document.createElement('option');
  fb.textContent = "Facebook";
  const other = document.createElement('option');
  other.textContent = "Другое";
  const contactInput = document.createElement('input');
  contactInput.classList.add('contact-input');
  contactInput.placeholder = "Введите данные контакта";
  contactInput.name = "contactInput";
  contactInput.required = true;
  const clearBtn = document.createElement('btn');
  clearBtn.classList.add('clear-btn');
  clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactForm.remove();
      const contactForms = document.querySelectorAll('.contact-wrapper');
    
      if (contactForms.length == 9) {
          const addBtn = createAddBtn();
          const addForm = document.querySelector('.add-form');
          addForm.insertBefore(addBtn, addForm.lastElementChild);

      }
  })
  select.append(tel);
  select.append(additionTel);
  select.append(email);
  select.append(vk);
  select.append(fb);
  select.append(other);
  contactForm.append(select);
  contactForm.append(contactInput);
  contactForm.append(clearBtn);
  return contactForm;
}

// функции валидации формы

function validateName(error) {
    const name = document.querySelector('input[name="name"]');
    const surname = document.querySelector('input[name="surname"]');
    if (!name.value) {
        name.classList.add('error-field');
        error.textContent += "Имя не заполнено! ";

        name.addEventListener('focus', () => {
            name.classList.remove('error-field');
        })
    }
    if (!surname.value) {
        surname.classList.add('error-field');
        error.textContent += "Фамилия не заполнена! ";

        surname.addEventListener('focus', () => {
            surname.classList.remove('error-field');
        })
    }
}

function checkName() {
    const name = document.querySelector('input[name="name"]');
    const surname = document.querySelector('input[name="surname"]');
    let flag;
    if (name.value && surname.value) {
        flag = true
    } else {

        flag = false
    }
    return flag;
}

function checkContacts() {
    let check;
    const contactInputs = document.querySelectorAll('.contact-input');
    let flag = true;
    for (let i = 0; i < contactInputs.length; i++) {
        if (!contactInputs[i].value) {
            flag = false;
            return;
        }
    }
    if (!contactInputs || flag) {
  
        check = true;
    } else {
  
        check = false;
    }
    return check;
}

// изменение hash
function changeHash(data) {
  document.location.hash = data;
}

async function locationHashChanged() {
    if (window.location.hash) {
        let get = window.location.href.split('#');
        const spinner = renderSpinner(9, 9, 7, 2, '0 0 20 20');
        const table = document.querySelector('table');
        let rowIndex = 0;
        for (i = 0; i < table.rows.length; i++) {
            if (table.rows[i].cells[0].textContent.includes(get[1])) {
                rowIndex = i;
                break;
            }
        }
        const btn = table.rows[rowIndex].cells[5].children[0];
        if(btn && btnLoadFlag){
           btn.append(spinner);
           spinner.classList.add('btn-spinner');
           btn.classList.add('btn-load');
            }
            const modal = await createAddModal(state.clients, 'change', get[1]);
            setTimeout(function () {
                if(btn) {
                spinner.remove();
                btn.classList.remove('btn-load');
                }
                const container = document.querySelector('.container');
                container.append(modal);
                const idSpan = document.querySelector('.id-span');
                idSpan.textContent = `ID: ${get[1]}` ;
            }, 500)
        }
    }

  //функции отрисовки спиннеров
  function createSpinner(cx, cy, r, stroke, viewbox) {
    const spinnerWrapper = document.createElement('div');
    const spinner = renderSpinner(cx, cy, r, stroke, viewbox);
    spinnerWrapper.classList.add('spinner-wrapper');
    spinnerWrapper.append(spinner);
    return spinnerWrapper;
}

function createBlock() {
    const spinnerWrapper = document.createElement('div');
    spinnerWrapper.classList.add('spinner-wrapper');
    return spinnerWrapper;
}

function renderSpinner(cx, cy, r, stroke, viewbox ) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('viewbox', viewbox);
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.classList.add('path');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke-width', stroke);
  svg.classList.add('spinner');
  svg.appendChild(circle);
  return svg;
}

//запуск приложения
async function createApp() {
    const table = createTableHeader().table;
    const header = createHeader().header;
    body.append(header);
    let container = createContainer();
    body.append(container);
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-wrapper');
    container.append(tableWrapper);
    tableWrapper.append(table);
    const spinner = createSpinner(36, 36, 30, 8, '0 0 72 72');
    body.append(spinner);
    state.clients = await loadClientList();
    setTimeout(function () {
        spinner.remove();
        const tableBody = createTableBody(state.clients);
        table.append(tableBody);
        const addBtn = createButton();
        body.append(addBtn);
        addBtn.addEventListener('click', async (e) => {
        const addModal = await createAddModal(state.clients, "create");
        body.append(addModal);
    })
    sortTable();
    }, 500)
    if (window.location.hash) {
        locationHashChanged();
    }
}


createApp();
window.onhashchange = locationHashChanged;





