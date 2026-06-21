## Principe d'import :

### Plusieurs choix sont possibles ( via les différentes commandes )

Dans l'absolu, soit le cas de base : `pnpm import:all`

- Cela vient récupérer/rafraichir la table Games
- Puis la table Pokemon, et enfin la table Statut.
- Pour cette dernière, on vient charger le premier sprite du pokemon disponible, relatif à son premier jeux d'apparition, qui sera son sprite par defaut stocké par le user d'id 0 (system)

### Cas de base : 
- Dans le cas d'un changement de sprites ( de default vers custom ) on vient créer un nouveau reccord Statut avec l'id du current user, l'id du pokemon concerné avec le sprite nouvellement choisi 
- Dans le cas d'une mise a jour ( différente de la valeur par defaut correspondante à celle du user d'id 0), on update simplement la différence de sprite
- Dans le cas d'un retour au sprite par default ( soit un retour au sprite du premiere jeux disponible), on supprime simplement le reccord correspondant dans la table status