#!/usr/bin/env python3
import webbrowser
import os
import subprocess
import sys

def generate_pdf():
    """Génère un PDF à partir du fichier HTML en utilisant le navigateur"""
    
    # Chemin vers le fichier HTML
    html_file = os.path.abspath("cv_sport_outdoor.html")
    
    print(f"📄 Génération du PDF à partir de: {html_file}")
    
    # Vérifier que le fichier HTML existe
    if not os.path.exists(html_file):
        print("❌ Erreur: Le fichier cv_sport_outdoor.html n'existe pas")
        return False
    
    try:
        # Ouvrir le fichier HTML dans le navigateur par défaut
        print("🌐 Ouverture du CV dans le navigateur...")
        webbrowser.open(f"file://{html_file}")
        
        print("""
✅ CV ouvert dans votre navigateur !

📋 Instructions pour générer le PDF :
1. Dans votre navigateur, appuyez sur Cmd+P (ou Ctrl+P sur Windows)
2. Sélectionnez "Enregistrer au format PDF" comme destination
3. Ajustez les paramètres d'impression :
   - Format : A4
   - Marges : Minimales
   - Options : Cocher "Arrière-plans graphiques"
4. Cliquez sur "Enregistrer" et nommez le fichier "CV_Etienne_Gaumery_Sport_Outdoor.pdf"

🎯 Le CV est optimisé pour l'impression avec un design professionnel adapté au secteur sport/outdoor.
        """)
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de l'ouverture du fichier: {e}")
        return False

if __name__ == "__main__":
    generate_pdf()

