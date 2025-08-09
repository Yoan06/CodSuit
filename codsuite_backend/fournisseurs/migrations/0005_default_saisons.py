from django.db import migrations


def create_default_saisons(apps, schema_editor):
    Saison = apps.get_model('fournisseurs', 'Saison')
    defaults = [
        'Hiver',
        'Automne',
        'Été',
        'Printemps',
    ]
    for nom in defaults:
        Saison.objects.get_or_create(nom=nom)


def reverse_default_saisons(apps, schema_editor):
    Saison = apps.get_model('fournisseurs', 'Saison')
    Saison.objects.filter(nom__in=['Hiver', 'Automne', 'Été', 'Printemps']).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('fournisseurs', '0004_saison_produit_saisons'),
    ]

    operations = [
        migrations.RunPython(create_default_saisons, reverse_default_saisons),
    ]


