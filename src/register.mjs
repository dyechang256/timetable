import { HomePage } from "./pages/home.mjs";
import { ClassEditPage } from "./pages/class-edit.mjs";
import { ClassListPage } from "./pages/class-list.mjs";
import { ClassListItemComponent } from "./components/class-list-item.mjs";
import { TimetableComponent } from "./components/timetable.mjs";
import { TimetableDetailComponent } from "./components/timetable-detail.mjs";

customElements.define("home-page", HomePage);
customElements.define("class-list-page", ClassListPage);
customElements.define("class-edit-page", ClassEditPage);
customElements.define("class-list-item", ClassListItemComponent);
customElements.define("timetable-component", TimetableComponent);
customElements.define("timetable-detail", TimetableDetailComponent);
