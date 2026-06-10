---
title: AI Doubling Rate
description: Analysis of AI task completion doubling rate based on METR research
image: /sims/ai-doubling-rate/ai-doubling-rate.png
og:image: /sims/ai-doubling-rate/ai-doubling-rate.png
twitter:image: /sims/ai-doubling-rate/ai-doubling-rate.png
social:
   cards: false
---
# AI Doubling Rate

<iframe src="./main.html" width="100%" height="530" scrolling="no" style="border: none;"></iframe>

[View Full Screen](./main.html){ .md-button .md-button--primary }

The length of tasks (measured by how long they take human professionals) that generalist frontier model agents can complete autonomously with 50% reliability has been doubling approximately every seven months for the last six years. The shaded region represents 95% Confidence Interval calculated by hierarchical bootstrap over task families, tasks, and task attempts.

## Interactive Features

- **Y-Axis Scale**: Toggle between Linear and Logarithmic views to see the exponential growth pattern
- **Success Rate**: Switch between 50% and 80% success probability metrics
- **Tooltips**: Hover over data points to see model details

## METR Benchmark Data

The following table shows AI model performance on the METR-Horizon-v1 benchmark, measuring the task horizon (in minutes) that models can complete with 50% success rate.

| Model | Release Date | Task Horizon (50%) |
|-------|--------------|-------------------|
| GPT-2 | 2019-02-14 | 2.4 sec |
| davinci-002 | 2020-05-28 | 8.9 sec |
| GPT-3.5 | 2022-03-15 | 36.3 sec |
| GPT-4 | 2023-03-14 | 5.4 min |
| GPT-4 Turbo | 2023-11-06 | 8.5 min |
| GPT-4 (Jan) | 2024-01-25 | 5.4 min |
| Claude 3 Opus | 2024-03-04 | 6.4 min |
| GPT-4 Turbo (Apr) | 2024-04-09 | 6.6 min |
| GPT-4o | 2024-05-13 | 9.2 min |
| Qwen 2 72B | 2024-06-07 | 2.2 min |
| Claude 3.5 Sonnet | 2024-06-20 | 18.7 min |
| o1-preview | 2024-09-12 | 22.0 min |
| Qwen 2.5 72B | 2024-09-19 | 5.2 min |
| Claude 3.5 Sonnet v2 | 2024-10-22 | 29.6 min |
| o1 | 2024-12-05 | 41.1 min |
| DeepSeek V3 | 2024-12-26 | 18.5 min |
| DeepSeek R1 | 2025-01-20 | 26.9 min |
| Claude 3.7 Sonnet | 2025-02-24 | 56.1 min |
| DeepSeek V3 (Mar) | 2025-03-24 | 23.3 min |
| o3 | 2025-04-16 | 1.6 hrs |
| o4-mini | 2025-04-16 | 1.3 hrs |
| Claude 4 Opus | 2025-05-22 | 1.4 hrs |
| Claude 4 Sonnet | 2025-05-22 | 1.2 hrs |
| DeepSeek R1 (May) | 2025-05-28 | 32.2 min |
| Gemini 2.5 Pro | 2025-06-05 | 39.5 min |
| Grok 4 | 2025-07-09 | 1.8 hrs |
| Claude 4.1 Opus | 2025-08-05 | 1.9 hrs |
| GPT-5 | 2025-08-07 | 2.3 hrs |
| Claude Sonnet 4.5 | 2025-09-29 | 2.0 hrs |
| GPT-5.1 Codex | 2025-11-19 | 2.9 hrs |
| Claude Opus 4.5 | 2025-11-24 | 4.8 hrs |

## AI's Ability to Handle Long Tasks

**Summary of the METR Research**

### Why This Matters

As artificial intelligence (AI) becomes more advanced, it's not just about answering trivia questions or writing short emails anymore. A key question now is:
**Can AI complete long, complex tasks the way humans can—like writing software, planning events, or conducting research?**

The METR team has developed a new, easy-to-understand way to measure this:

> **How long a task (in human time) can today's AI complete successfully?**

### What Did They Measure?

* METR looked at **170 real-world tasks** like fixing software bugs, writing reports, or planning multi-step actions.
* Each task was rated by how long it typically takes a **skilled human** to do it—from just a few minutes to several hours.
* Then they tested how well top AI systems performed those same tasks.

### What They Found

* Today's best AI systems (like OpenAI's and Anthropic's) can **reliably complete tasks that take up to about 5 hours of human effort**.
* For very short tasks (under 5 minutes), AI is nearly perfect.
* But as tasks get longer and more complex—especially past 8 hours—AI still struggles.
* Most importantly: **the ability of AI to complete longer tasks is doubling roughly every 7 months**.

### Why This Trend Is Big News

If the current pace continues:

* In **2–3 years**, AI may handle tasks that take a human **a full week or more**.
* In **5 years**, it may independently manage **projects that currently take a team of people a month**.

This means AI could soon:

* Write complete software products
* Research and draft business strategies
* Conduct customer support or internal reporting workflows end-to-end

### Things to Keep in Mind

* A 50% success rate isn't perfect. AI may still make mistakes or need supervision.
* These results are from test environments—not always real-world conditions.
* Longer-term planning and error handling are still hard for AI.

### What This Means for Strategy

* **Plan Ahead**: AI systems may soon be capable of completing longer tasks with little oversight.
* **Pilot Projects**: Start testing where AI might assist or automate longer workflows.
* **Talent Planning**: Expect changes in the types of roles that will benefit from human–AI collaboration.
* **Risk Management**: Use these benchmarks to guide safe and responsible AI adoption.

## Five Year Projection

Starting from late 2025 (~5 hours), if the 7-month doubling rate continues:

| Date | Projected Task Horizon |
|------|----------------------|
| November 2025 | 5 hours |
| June 2026 | 10 hours |
| January 2027 | 20 hours |
| August 2027 | 40 hours (1 week) |
| March 2028 | 80 hours (2 weeks) |
| October 2028 | 160 hours (1 month) |
| May 2029 | 320 hours (2 months) |
| December 2029 | 640 hours (4 months) |
| July 2030 | 1280 hours (8 months) |

## References

Here are the original source references from the Metr site:

- [METR: Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- [METR Benchmark Results (YAML)](https://metr.org/assets/benchmark_results.yaml)
