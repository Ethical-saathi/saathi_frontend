@echo off
cd /d "d:\frontend\front\src\components\ui"
for %%f in (accordion.tsx alert-dialog.tsx alert.tsx aspect-ratio.tsx avatar.tsx badge.tsx breadcrumb.tsx button.tsx calendar.tsx card.tsx carousel.tsx chart.tsx checkbox.tsx collapsible.tsx command.tsx context-menu.tsx dialog.tsx drawer.tsx dropdown-menu.tsx form.tsx hover-card.tsx input-otp.tsx input.tsx label.tsx menubar.tsx navigation-menu.tsx pagination.tsx popover.tsx progress.tsx radio-group.tsx resizable.tsx scroll-area.tsx select.tsx separator.tsx sheet.tsx sidebar.tsx skeleton.tsx slider.tsx switch.tsx table.tsx tabs.tsx textarea.tsx toggle-group.tsx toggle.tsx) do (
  if exist "%%f" del /f "%%f"
)
cd /d "d:\frontend\front\src\components\landing-page"
if exist "NavLink.tsx" del /f "NavLink.tsx"
cd /d "d:\frontend\front\src"
if exist "App.css" del /f "App.css"
cd /d "d:\frontend\front\src\hooks"
if exist "use-mobile.tsx" del /f "use-mobile.tsx"
echo Cleanup complete!
