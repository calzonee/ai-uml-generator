// import { StreamLanguage } from "@codemirror/language";
// import { HighlightStyle } from "@codemirror/language";
// import { tags as t } from "@lezer/highlight";

// // 1. Der PlantUML-StreamLanguage-Modus
// export const plantUML = StreamLanguage.define({
//   startState() {
//     return {};
//   },
//   token(stream) {
//     if (stream.match("@startuml") || stream.match("@enduml")) return "keyword";
//     if (stream.match(/->|-->/)) return "operator";
//     if (stream.match(/[A-Za-z_][A-Za-z0-9_]*/)) return "variableName";

//     stream.next();
//     return null;
//   },

//   languageData: {
//     tokenTable: {
//       keyword: t.keyword,
//       operator: t.operator,
//       variableName: t.variableName,
//     },
//   },
// });

// // 2. HighlightStyle exportieren
// export const plantUMLHighlightStyle = HighlightStyle.define([
//   { tag: t.keyword, color: "#ff79c6", fontWeight: "bold" },
//   { tag: t.operator, color: "#8be9fd" },
//   { tag: t.variableName, color: "#f8f8f2" },
// ]);
