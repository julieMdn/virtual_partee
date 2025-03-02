# Tests de l'application Virtual Partee

Ce répertoire contient les différents types de tests pour l'application Virtual Partee.

## Types de tests

### Tests unitaires

Les tests unitaires se trouvent dans le répertoire `src/__tests__/components/`. Ils testent des composants individuels de manière isolée, en mockant leurs dépendances.

### Tests d'intégration

Les tests d'intégration se trouvent dans le répertoire `src/__tests__/integration/`. Ils testent l'interaction entre plusieurs composants ou services pour vérifier qu'ils fonctionnent correctement ensemble.

### Tests end-to-end (E2E)

Les tests E2E se trouvent dans le répertoire `cypress/e2e/`. Ils testent l'application dans son ensemble, en simulant les interactions d'un utilisateur réel.

## Comment exécuter les tests

### Tests unitaires

Pour exécuter tous les tests unitaires :

```bash
npm test
```

Pour exécuter les tests en mode watch (ils se relancent automatiquement à chaque modification) :

```bash
npm run test:watch
```

### Tests d'intégration

Pour exécuter uniquement les tests d'intégration :

```bash
npm run test:integration
```

### Tests E2E

Pour exécuter les tests E2E avec l'interface graphique de Cypress :

```bash
npm run cypress
```

Pour exécuter les tests E2E en mode headless (sans interface graphique) :

```bash
npm run cypress:headless
```

Pour démarrer le serveur de développement et exécuter les tests E2E en une seule commande :

```bash
npm run test:e2e
```

## Couverture de code

Pour générer un rapport de couverture de code :

```bash
npm run test:coverage
```

Le rapport sera généré dans le répertoire `coverage/`.

## Bonnes pratiques

- Les tests unitaires doivent être rapides et isolés.
- Les tests d'intégration doivent vérifier les interactions entre les composants.
- Les tests E2E doivent simuler des scénarios utilisateur complets.
- Utilisez des mocks pour les dépendances externes (API, base de données, etc.).
- Assurez-vous que les tests sont déterministes (ils donnent toujours le même résultat).
- Évitez les dépendances entre les tests.
