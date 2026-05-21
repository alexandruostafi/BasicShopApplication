# Project General Coding Guidelines

## Software Versioning
- Semantic Versioning 2.0.0: https://semver.org/#semantic-versioning-200

## Commit Message Format
- Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
- Enforced via `commitlint` with `@commitlint/config-conventional`
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `release`

## Branching Strategy
- Single `main` branch for Continuous Delivery
- Feature/bugfix branches follow `<verb>-<segment>[-<segment>...]` pattern
- Branch name examples:
  * `feat-user-authentication` — new feature
  * `fix-cart-bug-42` — bug fix
  * `refactor-order-service-v2` — refactor without behavior change
- Special branches: `main`, `develop`, `release/<name>`, `hotfix/<name>`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (v18+) |
| Backend | Express 4.x |
| Database | SQLite via sql.js (in-memory for tests, file-backed in production) |
| Auth | express-session + bcrypt |
| Frontend | Vanilla HTML5, CSS, JavaScript (no framework) |
| Testing | Jest (unit + integration), Supertest (HTTP), Selenium (E2E), Playwright (E2E) |
| CI/CD | GitHub Actions |

## Test Frameworks & Strategy

| Level | Framework | Location | Command |
|-------|-----------|----------|---------|
| Unit | Jest | `tests/unit/` | `npm run test:unit` |
| Integration | Jest + Supertest | `tests/integration/` | `npm run test:integration` |
| E2E (legacy) | Mocha + Selenium WebDriver | `tests/selenium/` | `npm run test:selenium` |
| E2E (primary) | Playwright | `tests/playwright/` | `npm run test:playwright` |

### Test Conventions
- Unit tests use in-memory sql.js databases (no disk I/O)
- Integration tests spin up a real HTTP server on a random port
- E2E tests require the full server running on `localhost:3000`
- Test files are named `*.test.js` (Jest/Mocha) or `*.spec.js` (Playwright)
- Use `beforeEach` to reset database state for test isolation
- Use `supertest` agent for cookie/session persistence in integration tests

## Development Tools
- **Package manager**: npm
- **Dev server**: nodemon (auto-restart on file changes)
- **Linting**: commitlint (commit messages), branch-lint (CI)
- **Coverage**: Jest `--coverage` (lcov + text reporters)
- **Recommended extensions**: Jest, Playwright Test, Mocha, ESLint, REST Client, Prettier

## JavaScript Coding Guidelines
- Use `const` by default, `let` when reassignment is needed, never `var`
- Use `require()`/`module.exports` (CommonJS — no ES modules)
- Prefer `async/await` over raw Promises or callbacks
- Use early returns for guard clauses
- Keep route handlers focused — extract business logic into helpers when complex
- Use parameterized queries (`?` placeholders) for all SQL — never interpolate user input

## Project Structure
```
Cartify/
├── backend/
│   ├── server.js              # Express entry point (middleware + routes + listen)
│   ├── db.js                  # sql.js init, query helpers (all, get, run, transaction)
│   ├── seed.js                # Seed script for sample data
│   └── routes/
│       ├── auth.js            # /api/auth — register, login, logout, me
│       ├── products.js        # /api/products — CRUD + search/filter
│       ├── cart.js            # /api/cart — user cart management
│       ├── orders.js          # /api/orders — checkout + order history
│       └── admin.js           # /api/admin — dashboard, users, categories
├── frontend/
│   ├── index.html             # Product listing page
│   ├── product.html           # Product detail page
│   ├── cart.html              # Shopping cart
│   ├── checkout.html          # Checkout form
│   ├── orders.html            # Order history
│   ├── login.html             # Login form
│   ├── register.html          # Registration form
│   ├── admin.html             # Admin panel
│   ├── css/
│   │   └── styles.css         # Global styles
│   └── js/
│       ├── auth-common.js     # Session check + cart badge (included on all pages)
│       ├── index.js           # Product listing logic
│       ├── product.js         # Product detail logic
│       ├── cart.js            # Cart page logic
│       ├── checkout.js        # Checkout logic
│       ├── orders.js          # Orders page logic
│       ├── login.js           # Login form logic
│       ├── register.js        # Register form logic
│       └── admin.js           # Admin panel logic
├── tests/
│   ├── unit/                  # Jest unit tests (test db helpers, route logic)
│   │   ├── helpers/
│   │   │   └── setup.js       # In-memory db bootstrap + app builder
│   │   └── *.test.js
│   ├── integration/           # Jest + Supertest (real HTTP server, random port)
│   │   ├── helpers/
│   │   │   └── setup.js       # Server lifecycle + supertest agent factory
│   │   └── *.test.js
│   ├── selenium/              # Mocha + Selenium WebDriver E2E tests
│   │   ├── helpers.js
│   │   └── *.test.js
│   └── playwright/            # Playwright E2E tests
│       └── *.spec.js
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/                # Copilot Chat agent definitions
│   └── workflows/
│       ├── ci.yml             # Branch-lint + commit-lint + test pipeline
│       └── version-bump.yml   # Semantic version bump on merge to main
├── commitlint.config.js
├── jest.config.js
├── playwright.config.js
├── package.json
└── README.md
```
