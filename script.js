// Models

const User = Backbone.Model.extend({
  defaults: {
    id: "",
  },
});
let loggedInUser = new User();

const SelectedFolder = Backbone.Model.extend({
  defaults: {
    id: "",
  },
});
let selectedFolder = new SelectedFolder();

const Folder = Backbone.Model.extend({
  defaults: {
    folder_name: "",
    id: "",
  },
});

const Folders = Backbone.Collection.extend({});

const Note = Backbone.Model.extend({
  defaults: {
    note_title: "",
    note_description: "",
    note_status: "",
    id: "",
  },
});

const Notes = Backbone.Collection.extend({});

// Views

// LoginView
var LoginView = Backbone.View.extend({
  el: $("#app"),
  events: {
    "click #login": "login",
    "click #register": "register",
  },
  template: _.template(`
      <div class="loginOuterBox">
        <div class="loginBox">
            <h1>Login</h1>
            <input id="username" type="text" placeholder="Username" />
            <input id="password" type="password" placeholder="Password" />
            <button id="login">Login</button>
            <p id="register">New to app? Click here to Register</p>
        </div>    
      </div>
    `),
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  login: async function () {
    const data = {
      dataform: "yiouy6638v",
      filters: [
        {
          field: "email_address",
          op: "equal",
          values: [$("#username").val()],
        },
        {
          field: "password",
          op: "equal",
          values: [$("#password").val()],
        },
      ],
      getfieldvalues: false,
      override_default_filter: true,
      saved_filter_id: null,
      saveuserfilter: false,
      sortby: [],
    };
    const response = await fetch(
      "https://yash.test.orgzit.com/api/1/record/filter/yiouy6638v/?limit=20&offset=0",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if (result.meta.total_count > 0) {
      loggedInUser.set("id", result.objects[0].id);
      router.navigate("folders", { trigger: true });
    }
  },
  register: function () {
    router.navigate("register", { trigger: true });
  },
});

var RegisterView = Backbone.View.extend({
  el: $("#app"),
  events: {
    "click #login": "login",
    "click #register": "register",
  },
  template: _.template(`
      <div class="loginOuterBox">
        <div class="loginBox">
            <h1>Register</h1>
            <input id="firstName" type="text" placeholder="Enter your First Name" />
            <input id="lastName" type="text" placeholder="Enter your Last Name" />
            <input id="username" type="text" placeholder="Username" />
            <input id="password" type="password" placeholder="Password" />
            <button id="register">Register</button>
            <p id="login">Already a User? Click here to Login</p>
        </div>    
      </div>
    `),
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  register: async function () {
    const data = {
      dataform_id: "yiouy6638v",
      dataform: "/api/1/dataform/yiouy6638v/",
      fields: {
        first_name: $("#firstName").val(),
        last_name: $("#lastName").val(),
        email_address: $("#username").val(),
        password: $("#password").val(),
      },
    };
    const response = await fetch(
      "https://yash.test.orgzit.com/api/1/ozrecord/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(result)
    if (result.errors == undefined) {
      loggedInUser.set("id", result.id);
      router.navigate("folders", { trigger: true });
    }
  },
  login: function () {
    router.navigate("", { trigger: true });
  },
});

// FolderView
var FolderView = Backbone.View.extend({
  model: new Folder(),
  tagName: "tr",
  events: {
    "click .folder": "openFolder",
  },
  template: _.template(`
    <div class="folder">
      <img src="folder_icon.png" alt="Folder Icon" />
      <p id="folderName"><%= folder_name %></p>
    </div>
  `),
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  openFolder: function () {
    selectedFolder.set("id", this.model.get("id"));
    router.navigate("notes", { trigger: true });
  },
});

var FoldersView = Backbone.View.extend({
  el: $("#app"),
  model: new Folders([]),
  events: {
    "click #addFolder": "addFolder",
  },
  template: _.template(`
      <div id="newFolderAdd">
        <input id="folderInput" type="text" placeholder="Enter Folder Name" />
        <button id="addFolder">+ Add</button>
      </div>
      <h1>Folders</h1>
      <div id="folders-list"></div>
    `),
  initialize: async function () {
    this.model.on("add", this.renderFolders, this);
    const data = {
      dataform: "p5b728ctd9",
      filters: [
        {
          field: "account",
          op: "values",
          values: [loggedInUser.get("id")],
        },
      ],
      getfieldvalues: false,
      override_default_filter: true,
      saved_filter_id: null,
      saveuserfilter: false,
      sortby: [],
    };
    const response = await fetch(
      "https://yash.test.orgzit.com/api/1/record/filter/p5b728ctd9/?limit=20&offset=0",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if(this.model.toArray().length !== 0){
        this.model.reset()
    }
    result.objects.forEach((folder) => {
      this.model.add(
        new Folder({ id: folder.id, folder_name: folder.fields["dinxftpkq0"] })
      );
    });
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  addFolder: async function () {
    const data = {
      dataform_id: "p5b728ctd9",
      dataform: "/api/1/dataform/p5b728ctd9/",
      fields: {
        folder_name: $("#folderInput").val(),
      },
      dbvalues: {
        account: loggedInUser.get("id"),
      },
    };
    const response = await fetch(
      "https://yash.test.orgzit.com/api/1/ozrecord/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(result);
    if (result.errors == undefined) {
      var newFolder = new Folder({
        folder_name: $("#folderInput").val(),
        id: result.id,
      });
      this.model.add(newFolder);
    }
    $("#folderInput").val("");
  },
  renderFolders: function () {
    var self = this;
    this.$("#folders-list").html("");
    _.each(this.model.toArray(), function (folder) {
      self
        .$("#folders-list")
        .append(new FolderView({ model: folder }).render().$el);
    });
    return this;
  },
});

// NotesView
var NoteView = Backbone.View.extend({
  model: new Note(),
  tagName: "tr",
  events: {
    "click #completeButton": "completeNote",
  },
  template: _.template(`
        <div id="note">
            <div id="note_content">
                <p id="note_title"><span id="noteTitle"><%= note_title %></span></td>
                <p id="note_description"><span id="noteDescription"><%= note_description %></span></td>
            </div>
            <% if (note_status === 'Pending') { %>
                <div id="pendingContainer">
                    <p id="pendingStatus">Pending</p>
                    <p id="completeButton">Mark Completed</p>
                </div>
            <% } else { %>
                <p id="completedStatus">Completed</p>
            <% } %></span></p>
        </div>
    `),
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  completeNote: async function () {
    const data = {
      dataform_id: "z7tyt8h23n",
      dataform: "/api/1/dataform/z7tyt8h23n/",
      fields: {
        note_status: "Done",
      },
    };
    const response = await fetch(
      `https://yash.test.orgzit.com/api/1/ozrecord/${this.model.get("id")}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if (result.errors == undefined) {
      this.model.set("note_status", "Done");
      this.render();
    }
  },
});

var NotesView = Backbone.View.extend({
  el: $("#app"),
  model: new Notes(),
  events: {
    "click #addNote": "addNote",
  },
  template: _.template(`
      <input id="titleInput" type="text" placeholder="Enter Note Title" />
      <input id="descriptionInput" type="text" placeholder="Enter Note Description" />
      <button id="addNote">+ Add Note</button>
      <h1>Notes</h1>
      <div id="notes-list"></div>
    `),
  initialize: async function () {
    this.model.on("add", this.renderNotes, this);
    const data = {
      dataform: "z7tyt8h23n",
      filters: [
        {
          field: "folder",
          op: "values",
          values: [selectedFolder.get("id")],
        },
      ],
      sortby: ["-note_status"],
      getfieldvalues: false,
      override_default_filter: true,
      saved_filter_id: null,
      saveuserfilter: false,
      sortby: [],
    };
    const response = await fetch(
      "https://yash.test.orgzit.com/api/1/record/filter/z7tyt8h23n/?limit=20&offset=0",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    result.objects.forEach((note) => {
      this.model.add(
        new Note({
          note_title: note.fields["k4opzcamh0"],
          note_description: note.fields["gp4mrzxwbp"],
          note_status: note.fields["a3kufbj1ua"],
          id: note.id,
        })
      );
    });
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  addNote: async function () {
    const data = {
      dataform_id: "z7tyt8h23n",
      dataform: "/api/1/dataform/z7tyt8h23n/",
      fields: {
        note_title: $("#titleInput").val(),
        note_content: $("#descriptionInput").val(),
        note_status: "Pending",
      },
      dbvalues: {
        folder: selectedFolder.get("id"),
      },
    };
    const response = await fetch(
      "https://yash.test.orgzit.com/api/1/ozrecord/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "ApiKey yash:a76089db14d0ed98600ef3cdd697309618590f60",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if (result.errors == undefined) {
      var newNote = new Note({
        note_title: $("#titleInput").val(),
        note_description: $("#descriptionInput").val(),
        note_status: "Pending",
        id: result.id,
      });
      this.model.add(newNote);
    }
    $("#titleInput").val("");
    $("#descriptionInput").val("");
  },
  renderNotes: function () {
    var self = this;
    this.$("#notes-list").html("");
    _.each(this.model.toArray(), function (note) {
      self.$("#notes-list").append(new NoteView({ model: note }).render().$el);
    });
    return this;
  },
});

// Router

var Router = Backbone.Router.extend({
  routes: {
    "": "login",
    register: "register",
    folders: "folders",
    notes: "notes",
  },
  login: function () {
    var loginView = new LoginView();
    loginView.render();
  },
  register: function () {
    var registerView = new RegisterView();
    registerView.render();
  },
  folders: function () {
    var folderView = new FoldersView();
    folderView.render();
  },
  notes: function () {
    var notesView = new NotesView();
    notesView.render();
  },
});

var router = new Router();
Backbone.history.start();
