---
title: "Cloning the Field: My Pokémon TCG AI Battle Solution"
summary: "I copied 2,810 games from the top of the ladder into a 700k-parameter network, then spent a month finding out what the copy could not see."
date: 2026-08-20
draft: false
tags: ["machine-learning", "kaggle", "imitation-learning", "pokemon-tcg", "project"]
ogImage: "/writing/pokemon-tcg-ai-battle.jpg"
---

The simulation half of the PTCG AI Battle Challenge is over and the strategy report is the only card I have left to play. Evaluation is still running, my agent is hovering around 900, and I am somewhere in the 400s of about 6,800 teams. It peaked at 47th. It did not stay there.

This is the writeup of what I actually built, including the parts that did not work, which is most of them.

## The deck

`Marnie's Grimmsnarl ex / Munkidori`, dark type. The plan is not a damage race. It is to put down a body nothing removes cleanly and then win on arithmetic the opponent cannot interact with.

Grimmsnarl ex has 320 HP and attacks for 180 plus 30 to something on the bench. The bench 30 is the whole deck. Its ability, Punk Up, fires when you evolve into it and pulls up to five basic dark energy straight out of the deck, which is why a deck attacking with a 320 HP ex can run ten energy and zero manual acceleration. Rare Candy skips the middle stage so the trigger lands a turn early.

Then two damage sources the opponent cannot block. Munkidori moves up to three damage counters from your Pokémon to theirs, once a turn, which repairs the wall and adds reach in the same activation. Froslass puts a counter on every Pokémon with an ability on both sides during every checkup, which is symmetric on paper and asymmetric in practice, because my attacker is being healed by Munkidori and theirs is not.

So the win rarely arrives on one big attack. The opponent's whole board accumulates damage it cannot heal until everything on it dies to a number smaller than a full attack. The deck wins by making their board fragile, not by making my attacker bigger.

I did not design this 60. I mined it. It is card-for-card the most common exact list among top episodes, seen 353 times in a single day of data. That is an honest starting point and a slightly embarrassing one, and I will come back to it.

## The approach: clone the field

Two vCPUs and a 600-second budget for an entire game. That constraint decided everything.

Given a compute budget that small, the question is what the strongest available prior is, and my answer was the field itself. I scraped 2,810 games from the top of the published episodes, turned them into 248,985 decisions, and trained a roughly 700k-parameter listwise policy network to score each legal option. It runs in about a millisecond a move and spends 0.1 seconds of the 600-second pool for a whole game.

I did build search. It scored 0.323 against the clone and was mostly selecting rollout noise. Then I found the detail that settled it: the public 950-rated baseline's MCTS has never once executed. Two bugs, confirmed with timing instrumentation, and it holds its rating anyway. Search is not what wins on this board.

## The one thing that worked

For eight days the founding premise of the project was that the network could not see HP, so I had to supply the arithmetic myself with hand-written rules. I wrote it in a comment, restated it in my notes, and used it to justify every rule I built. It was wrong. The feature code had been feeding the network per-slot HP, damage, energy and prize value since the first version.

The actual gap was one line's worth. The per-option vector encoded position only as area flags and never encoded the option's own index. Two options naming two copies of the same card were bitwise identical inputs with different right answers. The network was not blind. It was being asked to distinguish two things I had handed it as the same thing.

Encoding the index scored 0.878 against a control trained on the same rows with the same seed. That is the run that took me from four figures on the leaderboard to 47th.

It also inverted the method. Once the option encoding carried that information, my three hand-written arithmetic rules measured 0.427 against the net, actively harmful, because they were now overriding a network that could finally see what they were computing. The shipped agent runs all three turned off.

That is the whole thesis, told through the deck. The game plan defined what the agent needed to know. I supplied it twice, once as rules and once as representation, and the representation won and made the rules redundant.

The generalizable version, and I think it is the most transferable thing I have: ask whether a blind spot is **informational** (the input is absent) or **representational** (the input is there but cannot be bound to the decision). From outside they look identical, because the agent is wrong at chance either way, and they have opposite cures.

## Everything after that was a null

Five generations of feature work went **+115, then +37, then +14, then 0, then 0** Elo. That curve is the honest summary of the project.

More data lost. I eventually built the largest corpus the axis allows, every episode the hosts ever released, 292,008 games and 40 million decisions, 160 times the data. It scored 0.440 against the small corpus and the interval excludes a coin flip. Unfiltered volume is not neutral here, it is negative, because the small corpus was cut to the top 400 players a day and the big one reaches down to 700-rated play. I did not add more of the same demonstrators. I added worse ones.

Better demonstrators lost too, and that was the surprise. I have every recent game from the players ranked second and third. Both are playing my exact list, card for card, down to the 1-ofs, and both are rated about 310 points above me. So the gap is a piloting gap, not a deck gap. I fine-tuned the clone on the number-two player's games and it worked as imitation, agreement with him went from 59.9% to 67.2%, and the resulting agent was **92 Elo weaker** than the one I already had. A gentler version, weighting every training row by the demonstrator's rating, was 55 Elo weaker.

Lining those up is the result. Disagreement with the field went 30.2%, then 32.0%, then 36.2%. Strength went 0, then −55, then −92. Every step away from the field's modal policy cost strength, in order, and the net that best imitates the second-best player on the leaderboard is the weakest agent I have ever built.

Behavior cloning gives you the *mode* of your demonstrator mixture. Agreement measures distance from that mode, not skill. My clone's agreement peaks at 76% against players rated 1050 to 1100 and falls off just as steeply going down as going up.

Validation accuracy is worse than weakly predictive here, it is uninformative. The feature block worth +37 Elo moved held-out agreement by **eight decisions out of 12,939**. A pooled option-set encoder built the following day moved it by **214 decisions** and bought +14 Elo. Same corpus, same recipe, one day apart, and the exchange rate between fit and strength differed by a factor of 70.

## The deck question, answered properly

Since the deck was netdecked, I owed the report an answer to whether I could do better than the list I copied.

So I froze a list of 11 variants in a committed file before any of the variant decks existed, because a search over 11 candidates at the usual significance threshold manufactures a winner for free. Rank all 11 cheaply, promote only the top one, and if it fails the search is over and no second candidate gets a try. The confirmation ran 57,600 games across seven opponent decks.

All 11 came in at or below the control. The one promoted candidate went negative on seven anchors of seven. The consensus 60 stands.

"I ran a proper search over the slot space and kept the list I started with" is a real deck result. It is not an Elo lever and I am not presenting it as one.

## The instrument was the real opponent

Halfway through, I submitted an agent purely to add logging, and only later realized it was decision-identical to the one it was built from. Same weights, same deck, same engine, byte for byte, differing in a print statement. Two agents that make the same move in the same state played the ladder side by side for a day.

They read **63.2 points apart**.

That is a true difference of exactly zero, displayed as 63 points. My best measured effect all competition was +37. So the leaderboard cannot adjudicate any change I have made or am likely to make, and every number in my report has to come from a 2,000-game local A/B against a byte-identical control instead. I spent a session's worth of prior treating a low leaderboard read as evidence against a good rule before I worked that out.

## What I got wrong

The report has a section for my own process failures and it runs seven items long. Two are worth repeating here.

The first is the premise above. False for eight days, repeated in three files, never once checked. A claim written down in enough places starts to feel verified when all that has really happened is that it became load-bearing. I later caught myself doing the same thing a second time in the same project, with a list of four "missing" features, three of which turned out to be already encoded.

The second is worse. For twelve days, four of my documents listed self-play reinforcement learning as a measured negative result. It was never run. No code, no sample size, no interval. It was a *decision* I made on a compute budget, filed where measurements go, quietly borrowing their authority. I retracted it in the report rather than delete it, which is the only way that kind of mistake ends up costing anything.

## Where that leaves me

The simulation category is decided and I did not win it. My best agent is a good clone of a decent human mixture, and the people at the top of that board are 300 points better with my exact 60 cards, doing something in the mirror that the mode does not do.

What I have instead is a report where every number traces to an archived run with a sample size and a confidence interval, including all the ones that say my ideas did not work. Top eight advance on the strategy category. It is due September 14 and it is the only thing left that can still go my way.

I would still rather have won the ladder.

<figure>
  <img src="/writing/pokemon-tcg-ai-battle.jpg" alt="Eight holographic Pokemon EX cards from the XY era laid out on a desk mat, including Entei EX, Rayquaza EX, Kyurem EX and Shaymin EX." />
  <figcaption>My crown jewels from an era gone by.</figcaption>
</figure>

---

The deck choice came out of the rolling meta plus a paper that proved PTCG can reach a Nash equilibrium for certain deck distributions: Ramos, Arthur F., and Tulio Soria. "From Rules to Nash Equilibria: A Lean 4 Case Study in Game-Theoretic Analysis of a Competitive Trading Card Game." arXiv preprint [arXiv:2607.08692](https://arxiv.org/abs/2607.08692) (2026).
