#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Section 1: Organisation & méthode
content = content.replace(
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Développement commercial & prospection</h4>',
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Organisation & méthode</h4>'
)

old_tags1 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Prospection</span>
                                    <span class="skill-tag">Qualification de leads</span>
                                    <span class="skill-tag">Présentation d'offre</span>
                                    <span class="skill-tag">Gestion de pipeline</span>
                                    <span class="skill-tag">Suivi de pipe commercial</span>
                                    <span class="skill-tag">Closing & signature</span>
                                    <span class="skill-tag">Vente à distance</span>
                                    <span class="skill-tag">Rendez-vous terrain</span>
                                    <span class="skill-tag">Identification de leviers d'acquisition</span>
                                </div>'''

new_tags1 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Organisation</span>
                                    <span class="skill-tag">Méthode</span>
                                    <span class="skill-tag">Structuration de processus</span>
                                    <span class="skill-tag">Gestion de dossiers</span>
                                    <span class="skill-tag">Suivi de procédures</span>
                                    <span class="skill-tag">Respect des normes</span>
                                    <span class="skill-tag">Rigueur & précision</span>
                                    <span class="skill-tag">Planification</span>
                                    <span class="skill-tag">Gestion de projets</span>
                                </div>'''

content = content.replace(old_tags1, new_tags1)

# Section 2: Assurance qualité & réglementation
content = content.replace(
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Relation propriétaire & commercial</h4>',
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Assurance qualité & réglementation</h4>'
)

old_tags2 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Gestion de la relation propriétaire</span>
                                    <span class="skill-tag">Instauration de confiance</span>
                                    <span class="skill-tag">Levée d'objections</span>
                                    <span class="skill-tag">Argumentation commerciale</span>
                                    <span class="skill-tag">Négociation</span>
                                    <span class="skill-tag">Structure de compte & groupes d'annonces</span>
                                    <span class="skill-tag">Fidélisation</span>
                                    <span class="skill-tag">Suivi de partenariats</span>
                                    <span class="skill-tag">Extensions d'annonces</span>
                                </div>'''

new_tags2 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Assurance qualité des fournitures</span>
                                    <span class="skill-tag">Management de la qualité</span>
                                    <span class="skill-tag">Réglementation des marchés publics</span>
                                    <span class="skill-tag">Contrôle industriel</span>
                                    <span class="skill-tag">Outils de maîtrise de la qualité produit</span>
                                    <span class="skill-tag">Évaluation de performance industrielle</span>
                                    <span class="skill-tag">Conformité & certification</span>
                                    <span class="skill-tag">G@EL (utilisateur clé)</span>
                                </div>'''

content = content.replace(old_tags2, new_tags2)

# Section 3: Analyse & coordination
content = content.replace(
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Immobilier & location courte durée</h4>',
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Analyse & coordination</h4>'
)

old_tags3 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Environnement immobilier</span>
                                    <span class="skill-tag">Location courte durée</span>
                                    <span class="skill-tag">Enjeux propriétaires</span>
                                    <span class="skill-tag">Gestion de biens</span>
                                    <span class="skill-tag">Valorisation de patrimoine</span>
                                    <span class="skill-tag">Réglementation locative</span>
                                    <span class="skill-tag">Conseil propriétaires</span>
                                </div>'''

new_tags3 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Analyse de données</span>
                                    <span class="skill-tag">Analyse de performance</span>
                                    <span class="skill-tag">Coordination métier</span>
                                    <span class="skill-tag">Coordination de projets</span>
                                    <span class="skill-tag">Chef de projet opération</span>
                                    <span class="skill-tag">Animation d'équipe</span>
                                    <span class="skill-tag">Reporting & synthèse</span>
                                </div>'''

content = content.replace(old_tags3, new_tags3)

# Section 4: Savoir-être & initiative
content = content.replace(
    "<h4 class=\"font-semibold text-text-gray text-sm mb-1\">Outils & environnement Digital Jouss'</h4>",
    '<h4 class="font-semibold text-text-gray text-sm mb-1">Savoir-être & initiative</h4>'
)

old_tags4 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Autonomie</span>
                                    <span class="skill-tag">Régularité</span>
                                    <span class="skill-tag">Orientation résultats</span>
                                    <span class="skill-tag">Recherche d'efficacité</span>
                                    <span class="skill-tag">Structuration de pipeline</span>
                                    <span class="skill-tag">Amélioration des conversions</span>
                                    <span class="skill-tag">Contribution à la croissance</span>
                                    <span class="skill-tag">Anglais (courant)</span>
                                </div>'''

new_tags4 = '''                                <div class="flex flex-wrap gap-1">
                                    <span class="skill-tag">Autonomie</span>
                                    <span class="skill-tag">Initiative</span>
                                    <span class="skill-tag">Dynamisme</span>
                                    <span class="skill-tag">Rigueur & méthode</span>
                                    <span class="skill-tag">Adaptabilité</span>
                                    <span class="skill-tag">Esprit d'équipe</span>
                                    <span class="skill-tag">Réactivité</span>
                                    <span class="skill-tag">Anglais (courant)</span>
                                </div>'''

content = content.replace(old_tags4, new_tags4)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Compétences adaptées pour l'assurance qualité!")
