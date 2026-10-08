<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Illustrative Claude Code setup, using the same environment variables as UseKeyModal.
// This preview never runs a command or carries a real API key.
</script>

<template>
  <div class="hitk-terminal">
    <div class="terminal-context">
      <span>Claude Code</span>
      <span class="dim">~/my-project</span>
    </div>
    <div class="terminal-setup">
      <p class="comment line" style="--delay: 0s"># {{ t('hitk.cliSetup') }}</p>
      <code class="command line" style="--delay: 0.1s"><span class="dim">export</span> ANTHROPIC_BASE_URL=<span class="value">"https://hitk.ai"</span></code>
      <code class="command line" style="--delay: 0.2s"><span class="dim">export</span> ANTHROPIC_AUTH_TOKEN=<span class="value">"YOUR_API_KEY"</span></code>
    </div>
    <div class="terminal-session">
      <p class="line" style="--delay: 0.3s"><span class="prompt">$</span> claude -p <span class="value">"Hi, Token"</span></p>
      <p class="reply line" style="--delay: 0.5s">{{ t('hitk.terminalReply') }}</p>
      <p class="line" style="--delay: 0.6s"><span class="prompt">$</span> <span class="cursor" aria-hidden="true"></span></p>
    </div>
    <div class="terminal-clients">
      <span>Claude Code</span><span>Codex</span><span>Gemini CLI</span>
    </div>
  </div>
</template>

<style scoped>
.hitk-terminal {
  display: flex;
  min-height: 360px;
  width: 100%;
  flex-direction: column;
  padding: 22px 24px;
  background: var(--hitk-dark-surface);
  color: #e5e5e5;
  font-family: ui-monospace, 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.85;
}
.terminal-context {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 12px;
  padding-bottom: 17px;
  border-bottom: 1px solid #303030;
}
.terminal-setup {
  margin-top: 20px;
}
.command {
  display: block;
  margin-top: 8px;
  overflow-wrap: anywhere;
}
.terminal-session {
  margin: 24px 0 20px;
}
.reply {
  margin: 12px 0;
}
.line {
  opacity: 0;
  animation: hitk-line-appear 0.2s ease forwards;
  animation-delay: var(--delay);
}
@keyframes hitk-line-appear {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.comment {
  color: #a3a3a3;
}
.value {
  color: #f5f5f5;
}
.dim {
  color: #a3a3a3;
}
.prompt {
  color: #a3a3a3;
  margin-right: 8px;
}
.terminal-clients {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: auto;
  font-size: 10px;
  line-height: 1.5;
}
.terminal-clients span {
  border: 1px solid #353535;
  border-radius: 5px;
  padding: 4px 7px;
  color: #b3b3b3;
}
.cursor {
  display: inline-block;
  width: 8px;
  height: 13px;
  vertical-align: middle;
  background: #e5e5e5;
  animation: hitk-blink 1s step-end infinite;
}
@media (max-width: 380px) {
  .hitk-terminal {
    padding: 20px 16px;
    font-size: 11px;
  }
}
@keyframes hitk-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .line {
    opacity: 1;
    animation: none;
  }
  .cursor {
    animation: none;
  }
}
</style>
