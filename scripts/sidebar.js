document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const sidebarText = document.querySelectorAll(".sidebarText");
  const sidebarNavItem = document.querySelectorAll(".sidebarNavItems");
  const sidebarHr = document.querySelectorAll(".sidebarHr");
  const sidebarButton = document.querySelectorAll(".sidebarNavItemButton");
  const mainContent = document.querySelector(".main-content");
  const sidebarHr1 = document.querySelectorAll(".sidebarHr1");
  const sidebarHr2 = document.querySelector(".sidebarHr2");
  const sidebarTitle = document.querySelector(".sidebarTitle");
  const workspace = document.querySelector(".workspace");
  const workspaceList = document.querySelector(".workspaceList");

  function collapseSidebar() {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("collapsed");
    sidebarText.forEach((element) => {
      element.classList.add("d-none");
    });
    sidebarHr.forEach((element) => {
      element.classList.remove("d-none");
    });
    sidebarButton.forEach((element) => {
      element.classList.add("collapsed");
    });

    setTimeout(() => {
      sidebarNavItem.forEach((element) => {
        element.classList.add("border-bottom");
      });
    }, 200);
    sidebarHr1.forEach((element) => {
      element.classList.add("collapsed");
    });
    sidebarHr2.classList.add("collapsed");
    sidebarTitle.classList.add("d-none");

    workspace.classList.remove("sidebarBorderLeft");
    workspaceList.classList.add("d-none");
    workspaceOpened = false;
    sidebar.setAttribute("data-state", "collapsed");
  }

  function openSidebar() {
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("collapsed");
    setTimeout(() => {
      sidebarText.forEach((element) => {
        element.classList.remove("d-none");
      });
      sidebarHr.forEach((element) => {
        element.classList.add("d-none");
      });
      sidebarButton.forEach((element) => {
        element.classList.remove("collapsed");
      });
      sidebarNavItem.forEach((element) => {
        element.classList.remove("border-bottom");
      });
      sidebarHr1.forEach((element) => {
        element.classList.remove("collapsed");
      });
      sidebarHr2.classList.remove("collapsed");
      sidebarTitle.classList.remove("d-none");
      workspace.classList.add("sidebarBorderLeft");
    }, 200);
    sidebar.setAttribute("data-state", "open");
  }

  let sidebarOpened = false;
  let workspaceOpened = false;

  sidebar.addEventListener("mouseenter", function () {
    openSidebar();
    sidebarOpened = true;
  });
  sidebar.addEventListener("mouseleave", function () {
    setTimeout(() => {
      collapseSidebar();
      sidebarOpened = false;
    }, 200);
  });

  const currentPath = window.location.pathname.split("/").pop(); // Get the current file name from the URL

  const dashboard = document.getElementById("dashboard");

  switch (currentPath) {
    case "dashboard.php":
      dashboard.classList.add("active");
      workspace.classList.remove("active");
      break;
    case "workspace.php":
      dashboard.classList.remove("active");
      workspace.classList.add("active");
      break;
    default:
      break;
  }

  workspace.addEventListener("click", () => {
    if (!workspaceOpened) {
      workspaceList.classList.remove("d-none");
      workspaceOpened = true;
      document.getElementById("workspace-arrow").classList.add("rotate-90");
    } else {
      workspaceList.classList.add("d-none");
      workspaceOpened = false;
      document.getElementById("workspace-arrow").classList.remove("rotate-90");
    }
  });

  getWorkspaceList();
  logout();

  async function logout() {
    document
      .getElementById("logoutButton")
      .addEventListener("click", async (e) => {
        e.preventDefault();

        const formDataObj = {
          action: "logout",
        };

        try {
          const response = await fetch("./backend/account.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataObj),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          alert(data.message);
          location.href = "./index.php";
        } catch (error) {
          console.error("Fetch error: " + error);
        }
      });
  }
});

// Fetch workspace list from database
function getWorkspaceList() {
  var data = {
    action: "getWorkspaceList",
  };

  fetch("./backend/workspace.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set Content-Type to application/json
    },
    body: JSON.stringify(data), // Convert data object to JSON string
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWorkspaceList(data);
    });
}

function displayWorkspaceList(data) {
  const currentUrl = new URL(window.location.href);
  const workspaceID = currentUrl.searchParams.get("workspace");

  const workspaceList = document.querySelector(".workspaceList");
  var html = "";
  data.forEach((element) => {
    // Base64 encode the workspaceID (Vulnerable to URL manipulation)
    const encodedWorkspaceID = btoa(element.workspace.workspaceID);
    const href = `./workspace.php?workspace=${encodedWorkspaceID}`;

    if (workspaceID === encodedWorkspaceID) {
      html += `      
    <a class="workspaceItems active" href="${href}">
        <div class="d-flex">
            <i class="bi bi-caret-right-fill me-2"></i>
            <div>
            <p class="mb-1">${element.workspace.workspaceName}<span class="members"><i class="bi bi-people-fill ms-2 me-1"></i>${element.members}</span></p>
            <p class="workspaceText">${element.taskAssigned} Assigned Pending Tasks</p>
            </div>
        </div>
    </a>`;
    } else {
      html += `      
    <a class="workspaceItems" href="${href}">
        <div class="d-flex">
            <i class="bi bi-caret-right-fill me-2"></i>
            <div>
            <p class="mb-1">${element.workspace.workspaceName}<span class="members"><i class="bi bi-people-fill ms-2 me-1"></i>${element.members}</span></p>
            <p class="workspaceText">${element.taskAssigned} Assigned Pending Tasks</p>
            </div>
        </div>
    </a>`;
    }
  });
  workspaceList.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  // Create Workspace Modal
  const createWorkspaceBtn = document.getElementById("createWorkspaceBtn");
  const createWorkspaceModal = new bootstrap.Modal(
    document.getElementById("createWorkspaceModal")
  );
  createWorkspaceBtn.addEventListener("click", function () {
    createWorkspaceModal.show();
  });

  // Create join workspace
  document
    .getElementById("joinWorkspaceForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("submitted");
      var formData = new FormData(e.target); // This will get all the form data

      fetch("./backend/joinWorkspace.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == "fail") {
            alert(data.message);
          } else if (data.status == "success") {
            alert(data.message);
            const encode = btoa(data.workspaceID);
            const redirect = `./workspace.php?workspace=${encode}`;
            window.location.href = redirect;
          }
        });
    });

  // Create Workspace Form
  document
    .getElementById("createWorkspaceForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("submitted");
      var formData = new FormData(e.target); // This will get all the form data

      fetch("./backend/createWorkspace.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status == "fail") {
            alert(data.message);
          } else if (data.status == "success") {
            alert(data.message);
            createWorkspaceModal.hide();
            console.log(data.code)
            showPostCreation(data.code, data.workspaceID, data.type);
            getWorkspaceList();
            e.target.reset();
          }
        });
    });
});

function showPostCreation(workspaceCode, workspaceID, type) {
  const postCreationModal = new bootstrap.Modal(
    document.getElementById("postCreationModal")
  );

  var postTitleDesc = document.getElementById("postTitleDesc");
  var postImg = document.getElementById("postImage");
  var title = document.getElementById("postSecTitle");
  var workspaceCodeEl = document.getElementById("postWorkspaceCode");
  var secDesc = document.getElementById("postSecDesc")


  if (type == "Personal") {
    postTitleDesc.innerHTML = "You can manage your tasks in your private workspace";
    postImg.setAttribute("src","./images/workspacePersonal.png");
    title.innerHTML = "Personal Workspace"
    workspaceCode.style.display="none";
    secDesc.innerHTML = `Welcome aboard! Your workspace is ready for <br> productivity.`
  } else {
    postTitleDesc.innerHTML = "You can invite people to your workspace via the generated  code";
    postImg.setAttribute("src","./images/workspaceCode.png");
    title.innerHTML = "Workspace Code:"
    workspaceCodeEl.style.display="block";
    workspaceCodeEl.innerHTML = workspaceCode;
    secDesc.innerHTML = `To manage or send invitations via email, navigate to <br> Workspace > Manage Workspace`;

  }

  var viewWorkspaceBtn = document.getElementById("viewWorkspaceBtn");
  const endcode = btoa(workspaceID);
  const redirect = `./workspace.php?workspace=${endcode}`;
  viewWorkspaceBtn.href = redirect;

  postCreationModal.show();
}
