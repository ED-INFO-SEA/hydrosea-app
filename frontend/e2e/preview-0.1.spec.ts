import { expect, test } from '@playwright/test';
const capture = async (page: import('@playwright/test').Page, nom: string) =>
  page.screenshot({ path: `captures-playwright/${nom}.png`, fullPage: true });
test('parcours métier complet Preview 0.1 sans saisie d’identifiant technique', async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible({ timeout: 30_000 });
  await capture(page, '01-accueil');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.locator('#username').fill(process.env.PREVIEW_USER ?? 'administrateur-demo');
  await page.locator('#password').fill(process.env.PREVIEW_PASSWORD ?? 'demonstration');
  await page.locator('#kc-login').click();
  await expect(page.getByRole('button', { name: 'Tiers', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Tiers', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nom', exact: true }).fill(`E2E-${Date.now()}`);
  await page.getByRole('textbox', { name: 'Prénoms', exact: true }).fill('HydroSEA');
  const creationTiers = page.waitForResponse(
    (reponse) => reponse.url().endsWith('/v1/tiers') && reponse.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Créer le Tiers' }).click();
  const reponseTiers = await creationTiers;
  expect(reponseTiers.status(), await reponseTiers.text()).toBe(201);
  await expect(page.getByRole('heading', { name: /TIE-/ })).toBeVisible();
  await capture(page, '02-tiers-cree');
  await page.getByRole('button', { name: 'Points', exact: true }).click();
  await page.getByRole('combobox').first().selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Créer', exact: true }).first().click();
  await page.getByRole('button', { name: 'Rendre disponible' }).click();
  await page.getByRole('button', { name: 'Accueil' }).click();
  await page.getByRole('button', { name: 'Points', exact: true }).click();
  await page.getByRole('combobox').last().selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Créer', exact: true }).last().click();
  await page
    .getByRole('group', { name: 'Point de desserte' })
    .getByRole('combobox')
    .selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Rattacher' }).click();
  await page.getByRole('button', { name: 'Ouvrir' }).click();
  await expect(page.getByText('OUVERT')).toBeVisible();
  await capture(page, '03-point-ouvert');
  await page.getByRole('button', { name: 'Contrats', exact: true }).click();
  await page.getByRole('combobox').first().selectOption({ index: 1 });
  await page.locator('input[type=date]').fill(new Date().toISOString().slice(0, 10));
  await page.getByRole('button', { name: 'Créer' }).click();
  await page.getByRole('group', { name: 'Tiers' }).getByRole('combobox').selectOption({ index: 1 });
  const ajoutTitulaire = page.waitForResponse(
    (reponse) => reponse.url().includes('/participants') && reponse.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Ajouter le titulaire principal' }).click();
  const reponseTitulaire = await ajoutTitulaire;
  expect(reponseTitulaire.status(), await reponseTitulaire.text()).toBe(201);
  await page.getByRole('button', { name: 'Valider' }).click();
  await page.getByRole('button', { name: 'Activer' }).click();
  await expect(page.getByText('ACTIF')).toBeVisible();
  await capture(page, '04-contrat-actif');
  await page.getByRole('button', { name: 'Compteurs', exact: true }).click();
  await page.getByPlaceholder('Numéro de série').fill(`E2E-${Date.now()}`);
  await page.getByPlaceholder('Fabricant').fill('HydroSEA');
  await page.getByPlaceholder('Calibre').fill('15');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page
    .getByRole('group', { name: 'Point de consommation' })
    .getByRole('combobox')
    .selectOption({ index: 1 });
  await page.getByLabel('Date de pose').fill(new Date().toISOString().slice(0, 16));
  await page.getByLabel('Index de pose').fill('0');
  await page.getByLabel('Référence d’intervention').fill('E2E-PREVIEW');
  await page.getByRole('button', { name: 'Poser' }).click();
  await expect(page.getByText('POSE')).toBeVisible();
  await expect(page.getByText('Affectation active')).toBeVisible();
  await capture(page, '05-compteur-pose');
  await page.getByRole('button', { name: 'Synthèse' }).click();
  await expect(page.getByText('Contrat actif')).toBeVisible();
  await expect(page.getByText('Titulaire principal')).toBeVisible();
  await expect(page.locator('.frise p').first()).toBeVisible();
  await capture(page, '06-synthese');
  await expect(page.locator('input').filter({ hasValue: /^[0-9a-f-]{36}$/i })).toHaveCount(0);
});
