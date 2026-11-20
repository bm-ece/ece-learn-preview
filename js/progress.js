// Calculs de progression Linux, sans effet sur les données sauvegardées.
// Chargé comme script classique avant app.js.
(function () {
  'use strict';
  window.ECE_PROGRESS = {
    summary(state, totalNotions) {
      const notions = state.done.size;
      const labs = state.labDone.size;
      return { notions, labs, totalNotions, xp: notions * 25 + labs * 150 };
    },
    byDomain(parts, commands, done) {
      return parts.map((part, index) => [
        part,
        commands.filter(command => command.part === index).length,
        commands.filter((command, commandIndex) => command.part === index && done.has(commandIndex)).length
      ]);
    }
  };
})();
