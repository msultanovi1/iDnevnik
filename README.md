# iDnevnik

## Opis Projekta

Web aplikacija 'iDnevnik' je razvijena kao studentski projekat na predmetu 'Interakcija čovjek-računar'. Svrha aplikacije je simulacija funkcionalnosti elektronskog dnevnika, s ciljem pružanja jasnog i intuitivnog korisničkog iskustva za tri uloge: nastavnika, roditelja i učenika.

Aplikacija omogućava:
- **Nastavnicima:** Evidenciju prisustva, unos i pregled ocjena, upravljanje planom i programom i slično.
- **Roditeljima:** Pregled ocjena i izostanaka svoje djece, te praćenje njihovog školskog uspjeha.
- **Učenicima:** Pregled vlastitih ocjena, izostanaka i rasporeda časova.

Projekat je izgrađen koristeći **Next.js**, **React**, i **TypeScript**, s ciljem pružanja brzog, sigurnog i intuitivnog korisničkog iskustva.

---

## Pokretanje Aplikacije

Za pokretanje aplikacije na vašem lokalnom računaru, pratite sljedeće korake.

### Preduslovi

Prije početka, provjerite da li su na vašem sistemu instalirani:
- **Node.js** (preporučena verzija 18.x ili novija)
- **npm** (ili Yarn)

**Provjera instalacije:**
Otvorite terminal i unesite sljedeće komande:

```bash
node -v
npm -v
git --version
```

Ako nisu instalirani, posjetite [zvaničnu web stranicu Node.js](https://nodejs.org/en) i preuzmite preporučenu verziju. npm dolazi u paketu s Node.js-om. Za Git, posjetite [zvaničnu web stranicu Git-a](https://git-scm.com/downloads).

#### Rješavanje problema s npm na Windows-u

Ako se pri pokretanju `npm` komande pojavi greška koja spominje **"running scripts is disabled"**, morate promijeniti sigurnosnu politiku u PowerShell-u.

1.  **Pokrenite PowerShell kao administrator:**
    * Kliknite na **Start** i ukucajte `PowerShell`.
    * Desnim klikom na **Windows PowerShell**, odaberite **"Run as administrator"**.

2.  **Unesite komandu za promjenu politike:**
    Unesite sljedeću komandu i pritisnite `Enter`:
    ```powershell
    Set-ExecutionPolicy RemoteSigned
    ```

3.  Kada vas zatraži da potvrdite, upišite **`Y`** (za "Yes") i pritisnite `Enter`.

Nakon toga, zatvorite administratorski prozor i nastavite s radom u uobičajenom terminalu. `npm` komande bi sada trebale raditi bez problema.

#### NAPOMENA: Vraćanje PowerShell sigurnosne politike

Nakon što završite s korištenjem aplikacije, možete vratiti sigurnosnu politiku na zadane postavke.

1.  **Pokrenite PowerShell kao administrator:**
    * Kliknite na **Start** i upišite `PowerShell`.
    * Desnim klikom na **Windows PowerShell**, odaberite **"Run as administrator"**.

2.  **Unesite komandu za vraćanje na zadane postavke:**
    Unesite sljedeću komandu i pritisnite `Enter`:

    ```powershell
    Set-ExecutionPolicy Default
    ```

3.  Kada vas sistem zatraži potvrdu, upišite **`Y`** i pritisnite `Enter`.

### Instalacija

1.  **Klonirajte repozitorij:**
    Otvorite terminal i klonirajte projekat s GitHuba:

    ```bash
    git clone https://github.com/msultanovi1/iDnevnik.git
    ```

2.  **Navigacija do foldera projekta:**
    Uđite u direktorij projekta:

    ```bash
    cd iDnevnik
    ```

3.  **Instalacija zavisnosti:**
    Instalirajte sve potrebne biblioteke i pakete:

    ```bash
    npm install
    ```
4.  **Generisanje Prisma klijenta:**
    Ovaj korak je ključan za povezivanje aplikacije s bazom podataka.

    ```bash
    npx prisma generate
    ```

### Pokretanje aplikacije

Nakon što su zavisnosti instalirane, pokrenite aplikaciju:

- U terminalu pokrenite sljedeću komandu:

    ```bash
    npm run dev
    ```

    Ovo će pokrenuti aplikaciju na adresi `http://localhost:3000`.

---
