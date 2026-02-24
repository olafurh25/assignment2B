import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";
const LOCAL_API = "http://localhost:3000/api/v1";
/* =========================
   QUOTE FEATURE
========================= */

/**
 * Fetch a quote from the API
 * @param {string} category - quote category
 */
const loadQuote = async (category = "general") => {
  try {
   const reply = await axios.get(`${API_BASE}/quotes`, {
      params: {category},
   });

   const quote = reply.data;

   const text = document.getElementById("quote-text");
   const author = document.getElementById("quote-author");

   if (text) {
      text.innerHTML = `"${quote.quote}"`;
   }
   if (author) {
      author.innerHTML = quote.author;
   }

  } catch (error) {
   console.error("Error fetching quote")
  };
}

/**
 * Attach event listeners for quote feature
 */
const wireQuoteEvents = () => {
  const btn = document.getElementById("new-quote-btn")
  const select = document.getElementById("quote-category-select");
  let category;

  if (select) {
   select.addEventListener("change", async () => {
      category = select.value;
      await loadQuote(category);
   });
  }

  if (btn && select) {
   btn.addEventListener("click", async () => {
      category = select.value;
      await loadQuote(category);
   });
  }
}
/* =========================
   TASKS FEATURE
========================= */
const updateTask = async (id, finished) => {
   try {
      await axios.patch(`${LOCAL_API}/tasks/${id}`, { finished });
   } catch (error) {
      console.error("Error updating task")
   }
}

const loadTasks = async () => {
  try {
   const reply = await axios.get(`${LOCAL_API}/tasks`);
   const tasks = reply.data;
   console.log(tasks);

   const list = document.querySelector(".task-list");
   if (!tasks || !list) return;

   list.innerHTML = "";

   tasks.forEach((t) => {
      const li = document.createElement("li");
      
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = t.finished === 1;
      checkbox.addEventListener("change", async () => {
         await updateTask(t.id, checkbox.checked ? 1 : 0);
      });
      
      const txt = document.createTextNode(t.task);
      /*Structure*/
      label.appendChild(checkbox);
      label.appendChild(txt);
      li.appendChild(label);
      list.appendChild(li);
   });

  } catch (error) {
   console.error("Error loading tasks");
  };
};

const createTask = async (field_val) => {
   try {
      const task_txt = field_val.trim();
      if (!task_txt) return;

      await axios.post(`${LOCAL_API}/tasks`, {
      task: task_txt,
    });

    await loadTasks();
   } catch (error) {
      console.error("Error creating task")
   }
};

const wireTaskEvents = () => {
  const btn = document.getElementById("add-task-btn")
  const field = document.getElementById("new-task");
  
  /* New Task */
  if (!btn || !field) return;

  const submit = async () => {
   await createTask(field.value);
   field.value ="";
  };
   
  /* Wire both on-screen button and enter */
  field.addEventListener("keydown", async (event) => {
   if (event.key === 'Enter') {
      event.preventDefault();
      await submit();
   }
  });
  btn.addEventListener("click", submit);
};


/* =========================
   NOTES FEATURE
========================= */
let org_notes = "";

const loadNotes = async () => {
  try {
   const reply = await axios.get(`${LOCAL_API}/notes`);
   const notes = reply.data.notes;
   console.log(notes);

   const area = document.getElementById("notes-text");
   if (!area) return;

   area.value = notes
   org_notes = notes

  } catch (error) {
     console.error('Error fetching notes')
  }
}

const updateNotes = async (text) => {
   try {
      await axios.put(`${LOCAL_API}/notes`, { notes: text });
      await loadNotes();
   } catch (error) {
      console.error("Error updating notes")
   }
}

const wireNotesEvents = () => {
   const area = document.getElementById("notes-text");
   const btn = document.getElementById("save-notes-btn");

   if (!area || !btn) return;

   area.addEventListener("input", () => {
      btn.disabled = area.value === org_notes
      }
   );

   btn.addEventListener("click", async () => {
      await updateNotes(area.value);
      btn.disabled = true;
   })
}

/**
 * Initialize application
 */
const init = async () => {

  wireQuoteEvents();
  wireTaskEvents();
  wireNotesEvents();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";

  await loadQuote(category);
  await loadTasks();
  await loadNotes();
};

/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
