# Admin Panel – Einrichtung

## 1. GitHub Personal Access Token erstellen

1. Gehe zu GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Klicke „Generate new token"
3. Berechtigungen: **Contents: Read and write** (für das handgemacht Source-Repo)
4. Token kopieren

## 2. Einträge in `/home/u237207940/domains/config.php` hinzufügen

```php
// Admin Panel
define('ADMIN_PASSWORD_HASH', '');  // Schritt 3 – Hash eintragen
define('GITHUB_TOKEN',  'github_pat_xxx...');
define('GITHUB_OWNER',  'dein-github-benutzername');
define('GITHUB_REPO',   'handgemacht');  // Source-Repo-Name
define('GITHUB_BRANCH', 'main');
define('GITHUB_ADMIN_BRANCH', 'admin/pending'); // Arbeitsbranch – erforderlich!
```

> **Wichtig:** Alle vier `GITHUB_*`-Konstanten **und** `GITHUB_ADMIN_BRANCH`
> müssen definiert sein, sonst startet das Panel nicht. Admin-Änderungen werden
> zuerst auf `GITHUB_ADMIN_BRANCH` gesammelt und erst beim Klick auf
> „Jetzt auf die Website stellen" nach `GITHUB_BRANCH` (main) übernommen.

## 3. Admin-Passwort-Hash generieren

Auf dem Hostinger-Server (via SSH oder PHP-Datei):

```php
<?php echo password_hash('dein-wunschpasswort', PASSWORD_BCRYPT); ?>
```

Den ausgegebenen Hash in `ADMIN_PASSWORD_HASH` eintragen.

## 4. Admin-Panel aufrufen

Nach dem nächsten Deploy erreichbar unter:  
`https://handgemacht-claudiawild.com/admin/`

## Verwendung

Das Bedienen läuft immer in **zwei Schritten**:

1. **Ändern** – Veranstaltung anlegen/bearbeiten/löschen oder Fotos hochladen/löschen.
   Diese Änderungen werden gespeichert, sind aber noch **nicht** auf der Website sichtbar.
2. **Veröffentlichen** – auf den gelben Knopf **„🚀 Jetzt auf die Website stellen"** klicken.

Solange es nicht veröffentlichte Änderungen gibt, erscheint auf jeder Seite ein
gelber Hinweis mit dem Veröffentlichen-Knopf – so kann der zweite Schritt nicht
vergessen werden. Mehrere Änderungen lassen sich sammeln und gemeinsam veröffentlichen.

Im Detail:

- **Neue Veranstaltung**: Übersicht → „+ Neue Veranstaltung" → Formular ausfüllen → Speichern
- **Veranstaltung bearbeiten / löschen**: Übersicht → „Bearbeiten" bzw. „Löschen"
- **Fotos verwalten**: Übersicht → Kategorie wählen → hochladen oder löschen

Nach dem Veröffentlichen dauert es ca. **5 Minuten**, bis die Website aktualisiert ist
(GitHub Actions baut die Seite neu und stellt sie automatisch online). Der
**Website-Status** oben auf der Übersicht zeigt live, ob gerade aktualisiert wird.
