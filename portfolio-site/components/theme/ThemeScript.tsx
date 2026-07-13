export function ThemeScript() {
  const js =
    "(function(){try{var h=new Date().getHours();var m=(h>=7&&h<18)?'day':'night';document.documentElement.setAttribute('data-daynight',m);}catch(e){document.documentElement.setAttribute('data-daynight','day');}})();";
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
