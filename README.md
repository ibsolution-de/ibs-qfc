# IBs QFC App

Just another QFC app for IBs.

## Prompt history to reproduce


History of prompts to recreate application from scratch.

--- 
I am thinking about macosx app with modern osx look and feel, white background, charcoal style and pastel colors. UX should had look&feel like shadcn components. Icons similar to "Zed Editor"( Zed, Hero, Lucide icons). App should help me plan human resources to different projects, i am in rolle Project Manager.
Few use cases:
use calendar with working days in one row for whole month, i plan year quarter as forecast for projects. I place employees on days with project. Perfectly only one project per day, but it can happen that there are max 3 projects. Visually whole quarter is shown, one month hat whole row and splittet to month, weeks (with number), and days (working days with date).
I will see who on what day is planed to what project. I also need to see how much everybody is planed, if there are free days, or fully planed. I plan for each employee in my team. Need to see all on one screen. But different scaling on month, or quarter. Each project has own color (label, tag)
Other usecase is : quarterly forecast call with me and my ceo, showing quartal data. We analyse next 3 month in quartal. Team total capacity pro month in days, List on current running projects (name, client name, topic, budget, starting or end dates). Then available team capacity in days. Then "must win opportunities) with volume and possible starting date. Then alternative Opportunities for projects with same (volume, starting date, name and client name). Then available open team capacity after all oportunities. As last - notes. Also we habe same for next quarter for year, and also next to it same for one more next quarter.
Try to find best UI to this usecases. Analyze else ideas over internet for project planing and resource management.
Provide slick looking application vision. It should be clickable and cover this usecases fully. I want to be able make inputs, see results, calendar and qfc planing values.
---

In the Resource Planner, add a legend that explains what each pastel color signifies for projects.

--- 

In the Resource Planner, add a button next to each employee name that allows the user to assign a project to that employee for the currently selected date.

--- 
Resource Plan - i need "week number" label (KW1 - KW52) for each week
--- 
Resource Plan - if i switch to Quarter view i need to see 3 rows with 3 month from selected quarter, current one has to be labeled. Implement this view switch
--- 
One more usecase. I need versions of the states. Each Quarter or even Month need to be new version, i want to have kind "time machine" to see history of my project plans.
--- 
I would like to split Resource Plan Quarter view to 3 time each month row, one below other and not on single row long. Employee list should be same - 3 times
---

No, this is wrong. I just wanted to see same as Month view, but 3 times. So i have month calender but for whole Quarter.Try to feet window width and break Monthes down to fill hight. Current view of this part is not usable

--- 

I want to add you some real life data and infos.

Projects:

- MAN, Energy Management System 50k (10/2025)
- IBs, Internal QFC App 5k (12/2025)
- Soka Bau, ÜBA 2.0 100k (01/2026)
- Soka Bau, Weiterbildung 80k (07/2025)
- Storck, Intralogistic Shuttle 100k (02/2026)
- Storck, Rampe 160 - ?k (05/2026)

Team:

- Nazar Kulyk (me, PM, Architect, Dev)
- Max Berreichsleiter (Dev, DevOps, Sub Architect, Backend)
- Dana Turocman (Dev, Frontend, UX/UI, Design, Testing)
- Test Freund (Requirements, Dokumentation, Interviews, Design Leds)

Show page as me (Nazar Kulyk) would be logged in.

--- 
Rename App title from "Lumina Plan" to "IBs QFC" for short and "IBs QFC Planing and Forecast App".

-- 

For "Quartery Forecast" view and part "Current Quartal" i need to see inside this card also split for monthes (3 month) for capacities in PTs (days)

--- 
Perfect but i need it for "Team Capacity total", "available team capacity" (without vacation, other leavings) and "team capacity optimistic"(after all opportunities are planed)

---
For "Quartery Forecast" view and part "Quartal" (for all) i need to see project posible start date on each project line, where budget is shown.

---

Use colored icon for projects. Each project should have a small colored icon from icon library next to its name that matches the project's assigned pastel color in the Resource Planner. This will help visually link projects across different sections of the app.

--- 
Search Internet and add some example data for projects as "must win opportunities" and "alternative opportunities" with volume and possible starting date.

--- 
Make view of 3 versions:

- Inital Q4 2025 Plan
- Addjusted Q4 2025 Plan after QFC Call
- Preparing Q1 2026 Plan

Each version should be selectable from a dropdown at the top of the Resource Planner. When a version is selected, all data in the planner and quarterly forecast view should update to reflect that version's plan.
--- 

Now i miss other quarters except current on "Quarterly Forecast" view. Please show it again like it was in previous version.

--- 

Also there is no need to switch on version on "Resource Plan" view. It should always show current version only. Versioning is for whole state, only last version is editable.


--- 
Add some buttons on appropriate places:

- to export current state as Excel for further analysis and sharing with stakeholders.
- to export current plan as Excel for further analysis and sharing with clients.
- create powerpoint slide from Quarterly Forecast view for presentation to CEO.
- create request to Factura team to create SAP Account with proper budget.

--- 
Make current quarter "Q4 2025" on "Quarterly Forecast" view editable for me as PM. I want to change values for "must win opportunities" and "alternative opportunities" directly in this view.

--- 

Nice, i like it. On view "Quarterly Forecast" actually is Q1 as current quarter. Please fix it to Q4 2025.
---  


In Resource Plan view, make option to easy add new project to day cell when already project was planed on this day. Make also drag and drop of planed projects over days for one single employee (only within row). Let me also add multiple project at once if i click on day cell and select multiple projects from list.

--- 
In Resource Plan view, if i am mouse hover day for single person, place add button on bottom of cell to add new project to this day for this employee.
--- 

Give me option on Resource Plan view to plann whole month for single employee to single project with one click on project label in project list. Let me mark week days first like (monday, friday so that employee is planed for this days whole month to this project).

--- 
i see your implementation but cant see result in app. please review
--- 

Current state shows some project assignments for Oktober 2025, please make also some 90% team capacity planing to soka bau projects in November 2025 and December 2025 for Dana Turocman and Max Berreichsleiter full, me 75% time.

--- 
If i switch between Views and go back to Resource Plan, please switch to current month (November 2025 for now) view automatically. Later you can implement remember last state per view and make it customizable in settings.

--- 
Implement View for:

- "Manage" - "Team" - "Employees". Here i can add, edit, remove employees from team. Each employee has: Name, Role, Skills (list of tags), Availability (working days per month in percent), Contact Info (email, phone), Notes (text area for additional info). Also option to upload profile picture.
- "Manage" - "Projects". Here i can add, edit, remove projects. Each project has: Name, Client Name, Topic, Budget, Start Date, End Date, Status (Active, Completed, On Hold), Color Tag (for Resource Planner), Notes (text area for additional info).
- Versions Plus button should show dialog to create new version with name and description.

---

"Quarterly Forecast" view - definition what Quarter should be showed. Based on current Date show current quarter of year (its Q4 2025 for now) and 2 next (Q1 2026 and Q2 2026).

--- 
In Quarterly Forecast view, i have negativ Capacity for current Q4 2025, please change data to make it positiv.
--- 

--- 
In Quarterly Forecast view, for last Quarter make data that team is not full planed, basicaly very under planed.
--- 

Add Opportunities and add alternative opportunities should be possible for all Quarters in "Quarterly Forecast" view, not only for current one.

--- 

You made in one of previous steps "Resource Plan" view broken. I liked it before. Please restore it to previous working state with month view in single row for month, weeks and days. Specialy Quarter resolution view.
--- 
Thats still not the "Resource Plan" Month and Quarter view i found good earlier. Please reimplement view we had few implementations befor.
--- 
On "Resource Plan" Month and Quarter view, Column Employee was better in earlier stages. Please provide more information to employe about coapacity and planing status. Like total capacity in days, planed days, free days, percentage planed.
--- 

Please provide internatonalization (i18n) support for the application. Implement language selection option in settings with at least two languages: English and German. All static text in the application should be translatable based on the selected language.
Default app language should be German.
Create something on clicking "Settings" in Main Menu. Make some basic settings. Language switch.
--- 
Make versions place for list of version in main menu little bit brighter to see better all versions.

---

Some one can only work (make changes) when in main menu only latest (top) version is selected. Otherwise for all other older versions "Resource Plan" and "Quarterly Forecast" is only in read only mode and not editable. All buttons are not visible.
If latest version is selected version im main menu is edatable in other main menus like its now.
---

In Resource Plan view, if i am mouse hover day for single person and already planed day, i want to be able to remove it with click on smal icon for removal.

--- 

For main menu Versions, please try to imagine something like timeline ui component to use, not simple list. Each version should be represented as a point on timeline with name and date. Current version should be highlighted.

--- 
In Resource Plan view - Legend. I like more if it would inside dialog on button click, not always visible on screen.
--- 

In Resource Plan view - Month card became y-axis scrollbar, make card full hight to see all employees without scrolling.
