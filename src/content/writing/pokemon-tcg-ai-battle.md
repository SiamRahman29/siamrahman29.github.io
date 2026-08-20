---
title: "Cloning the Field: My Pokémon TCG AI Battle Solution"
summary: "I copied 2,810 games from the top of the ladder into a 700k-parameter network, then spent a month finding out what the copy could not see."
date: 2026-08-20
draft: false
tags: ["machine-learning", "kaggle", "imitation-learning", "pokemon-tcg", "project"]
ogImage: "/writing/pokemon-tcg-ai-battle.jpg"
---

<figure>
  <img src="/writing/pokemon-tcg-ai-battle.jpg" alt="Eight holographic Pokemon EX cards from the XY era laid out on a desk mat, including Entei EX, Rayquaza EX, Kyurem EX and Shaymin EX." />
  <figcaption>My crown jewels from an era gone by.</figcaption>
</figure>

The simulation half of the PTCG AI Battle Challenge is over. My agent is hovering around 900, somewhere in the 400s of about 6,800 teams. It peaked at 47th. It did not stay there.

Here is what I built.

## The deck and the agent

`Marnie's Grimmsnarl ex / Munkidori`. A 320 HP attacker that refuels itself, sitting behind chip damage the opponent cannot block: 30 to the bench every attack, three damage counters moved by Munkidori every turn, one more on everything from Froslass every checkup. It wins by making the opponent's board fragile, not by making my attacker bigger. I did not design the 60. It is card-for-card the most common list at the top of the ladder.

Two vCPUs and 600 seconds for a whole game, so I skipped search and cloned the field instead: 2,810 games from the best players, 248,985 decisions, a ~700k-parameter network that scores each legal option in about a millisecond. I did build search first. It scored 0.323 against the clone.

## The one thing that worked

For eight days I believed the network could not see HP, and wrote hand-crafted arithmetic rules to compensate. It could see HP the whole time.

The real defect was one line. The per-option vector never encoded the option's own index, so two options naming two copies of the same card were **bitwise identical inputs with different right answers**. Encoding it scored 0.878 against a control trained on the same rows with the same seed, and took me from four figures to 47th.

It also killed my rules. Once the network could see what they were computing, they measured 0.427 against it. The shipped agent runs all three turned off.

The lesson I would keep: ask whether a blind spot is **informational** (the input is missing) or **representational** (the input is there but cannot be bound to the decision). They look identical from outside and have opposite cures.

## Everything after that was a null

Five generations of feature work went **+115 → +37 → +14 → 0 → 0** Elo.

More data lost — 40 million decisions scored 0.440 against my 248,985. Better demonstrators lost too: fine-tuning on the second-ranked player's games made the agent **92 Elo weaker**, even though it imitated him successfully. Behavior cloning gives you the *mode* of your demonstrator mixture, and every step away from that mode cost strength.

Validation accuracy never predicted any of it. The feature block worth +37 Elo moved held-out agreement by eight decisions out of 12,939. A change the next day moved it by 214 and bought +14.

Then I found out the leaderboard could not referee any of this. I once had two submissions live that were decision-identical, differing only in a print statement. They read **63 points apart**. My best real effect was 37.

## Where that leaves me

The people above me are 300 points better with my exact 60 cards. What I have instead is a strategy report where every number traces to an archived run with a sample size and an interval, including all the ones that say my ideas did not work. Top eight advance. It is due September 14.

I would still rather have won the ladder.

---

Deck choice came out of the rolling meta plus Ramos and Soria, ["From Rules to Nash Equilibria"](https://arxiv.org/abs/2607.08692) (2026), which proved PTCG can reach a Nash equilibrium for certain deck distributions.
