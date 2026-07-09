---
title: "Which teams got the easy brackets in this World Cup?"
summary: "I ran the knockout draw through the Elo rating system to find out who got a soft road to the final and who got robbed."
date: 2026-07-09
draft: false
tags: ["football", "world-cup", "data-analysis", "elo"]
ogImage: "/writing/world-cup-elo-route.jpg"
---

Every World Cup, the group stage ends and the same argument starts. Someone won their group and still swears they got the harder half of the bracket. Someone else scraped through in third and quietly has the clearest run to the final anyone has seen. I wanted to stop arguing about it and actually measure it.

So I ran the whole knockout draw through the Elo rating system.

## How I measured "easy"

Elo is the same rating idea that ranks chess players. Every team carries a number, and that number moves after every match depending on who they beat and by how much. It is a cleaner signal than a group table because it carries history, not just the last three games.

The first graph is the simple one. For every team, I looked at their possible path to the final and took the **average Elo rating of the opponents they could face along the way**. The "could face" part isn't a guess. Elo has its own formula for the probability of one team beating another, so I let the bracket play out probabilistically instead of assuming the higher seed always wins. Lower average opponent rating means an easier road.

![Easiest route by Elo ratings: average opponent Elo for each team, sorted from easiest to hardest, with Argentina at the top.](/writing/world-cup-elo-route.jpg)

The second graph adds momentum. A team's rating tells you where they are, not where they are heading. So I blended current Elo with how much each team's rating had moved over the last 3 months, 6 months, and 1 year, with different weights on each window. A team quietly climbing for a year reads differently from one riding a two-week hot streak, and this graph tries to catch that.

![Easiest route by a standardized blend of current Elo and rating change over 3 months, 6 months, and 1 year, sorted from easiest to hardest.](/writing/world-cup-blend-route.jpg)

In both graphs, the font color marks how a team finished its group: gold for winners, silver for runners-up, bronze for third place. That coloring is where the story gets fun.

## Argentina got the easiest bracket, and Portugal handed theirs away

Argentina sits at the top of both graphs. Whichever way you measure it, they have the softest route to the final.

Judging by raw Elo, Colombia has the second easiest road, and the momentum graph agrees that their path is comfortable too. Here is the part that stings if you are Portuguese: Portugal could have been sitting exactly where Colombia is. All they had to do was beat DR Congo. They didn't, they slid down the bracket, and now they are staring at a much rougher path.

Portugal is responsible for its own misfortune. Then again, who isn't.

## Brazil, Switzerland and Mexico are the ones who actually got robbed

This is where finishing first stops meaning what you'd expect.

Brazil, Switzerland and Mexico all won their groups. All three drew tougher brackets than several runners-up, and tougher than even a couple of third-place teams. Winning your group is supposed to buy you an easier knockout road. For those three it bought them nothing.

Norway got a version of the same deal. They finished second and still ended up with a harder path than Senegal, who came third in their own group. Morocco slipped past Brazil the same way, a better road despite a lower finish.

If you only looked at the group tables, you would have these teams ranked in exactly the wrong order.

## Norway resting against France wasn't a bracket play

When a strong team takes its foot off the gas in the final group game, the usual accusation is that they are tanking for an easier draw. Norway coasting against France set that theory off immediately.

The numbers don't back it up. Norway's road is genuinely tough. They are looking at England and Brazil, or whoever knocks those two out, and both of them are rated higher than Germany and the Netherlands, who are the likely obstacles on France's side. If Norway were engineering an easy bracket, this is not the one they would have engineered.

The far more likely explanation is boring: they were resting core players before the knockouts. Sometimes the simplest read is the correct one.

## The takeaway

Group finishes are a noisy signal. They tell you who topped a table of three games, not who is walking into a soft knockout draw. Run the draw through Elo and the real picture shows up: a group winner can inherit a brutal path while a third-place team strolls toward the final.

Argentina got the gift. Brazil, Switzerland and Mexico got the short end. And Portugal, as usual, did it to themselves.

The code, the ratings, and both graphs are [on GitHub](https://lnkd.in/gbw9awP8) if you want to poke at the weights or argue with my assumptions.

If you have variations you'd want to see run, tell me.
