-- Deduplicate Game entries before adding UNIQUE on nameEn

UPDATE "Statut" s
SET "idGameProvenance" = (
    SELECT MIN(g2.id)
    FROM "Game" g2
    WHERE g2."nameEn" = (
        SELECT g3."nameEn" FROM "Game" g3 WHERE g3.id = s."idGameProvenance"
    )
)
WHERE s."idGameProvenance" NOT IN (
    SELECT MIN(id) FROM "Game" GROUP BY "nameEn"
);

DELETE FROM "Game" g
WHERE g.id NOT IN (
    SELECT MIN(id) FROM "Game" GROUP BY "nameEn"
);

ALTER TABLE "Game" ADD CONSTRAINT "Game_nameEn_key" UNIQUE ("nameEn");
