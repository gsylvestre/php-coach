var catalog_symfony = {
    "The controller must return a response": {
        "description": "Votre méthode de contrôleur ne retourne pas de réponse !",
        "reasons": [
            "Vous n'appelez pas la méthode <code>$this->render()</code> (twig)",
            "Vous avez oublié un <code>return new Response()</code> ou similaire"
        ]
    }
}
