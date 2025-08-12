export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Race Planner. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Créé par <span className="font-medium text-foreground">Charles Duc</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
