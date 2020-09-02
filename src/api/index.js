// home
import { fetchAnimeList } from './modules/home'

// dictionary
import { fetchDictionary } from './modules/dictionary'

// user
import { signIn, signUp, signOut, fetchUserInfo } from './modules/user'

// entry-anime
import { fetchAnimeEntry, fetchAnimeScore } from './modules/entry/entry-anime'
// entry-person
import { fetchPersonEntry } from './modules/entry/entry-person'

// edit
import { fetchRecordsForEditor, fetchAnimeRecordForEditor, fetchPersonRecordForEditor } from './modules/edit'
// edit-cover
import { uploadCover, deleteCover } from './modules/edit/edit-cover'
// edit-anime
import { fetchAnimeDraft, saveAnime, submitAnime, deleteAnime } from './modules/edit/edit-anime'
// edit-person
import { fetchPersonDraft, savePerson, submitPerson, deletePerson } from './modules/edit/edit-person'

// review
import { saveAnimeReview, fetchAnimeReview, deleteAnimeReview } from './modules/review'

// audit
import { fetchRecordsForAuditor, fetchAnimeRecordForAuditor, fetchPersonRecordForAuditor } from './modules/audit'
// audit-anime
import { approveAnime, denyAnime } from './modules/audit/audit-anime'
// audit-person
import { approvePerson, denyPerson } from './modules/audit/audit-person'

// admin-anime-record
import { fetchAnimeRecords, fetchAnimeRecord, closeAnimeRecord, openAnimeRecord, rollbackAnimeRecord, deleteAnimeRecord } from './modules/admin/admin-anime-record'
// admin-anime
import { fetchAnimes } from './modules/admin/admin-anime'
// admin-anime-other-name
import { fetchAnimeOtherNames } from './modules/admin/admin-anime-other-name'
// admin-anime-type-genre
import { fetchAnimeTypeGenres } from './modules/admin/admin-anime-type-genre'
// admin-anime-region
import { fetchAnimeRegions } from './modules/admin/admin-anime-region'
// admin-anime-release-date
import { fetchAnimeReleaseDates } from './modules/admin/admin-anime-release-date'
// admin-anime-copyright
import { fetchAnimeCopyrights } from './modules/admin/admin-anime-copyright'
// admin-anime-staff
import { fetchAnimeStaffs } from './modules/admin/admin-anime-staff'
// admin-anime-cast
import { fetchAnimeCasts } from './modules/admin/admin-anime-cast'
// admin-person-record
import { fetchPersonRecords, fetchPersonRecord, closePersonRecord, openPersonRecord, rollbackPersonRecord, deletePersonRecord } from './modules/admin/admin-person-record'
// admin-dictionary-position
import { fetchDictionaryPositions, addDictionaryPosition, updateDictionaryPosition, deleteDictionaryPosition } from './modules/admin/admin-dictionary-position'
// admin-dictionary-person
import { fetchDictionaryPersons, addDictionaryPerson, updateDictionaryPerson, deleteDictionaryPerson } from './modules/admin/admin-dictionary-person'

/**************************************************************************************************************************************************/

// public
export { fetchAnimeList }

// dictionary
export { fetchDictionary }

// user
export { signIn }
export { signUp }
export { signOut }
export { fetchUserInfo }

// entry-anime
export { fetchAnimeEntry }
export { fetchAnimeScore }
// entry-person
export { fetchPersonEntry }

// edit
export { fetchRecordsForEditor }
export { fetchAnimeRecordForEditor }
export { fetchPersonRecordForEditor }
// edit-cover
export { uploadCover }
export { deleteCover }
// edit-anime
export { fetchAnimeDraft }
export { saveAnime }
export { submitAnime }
export { deleteAnime }
// edit-person
export { fetchPersonDraft }
export { savePerson }
export { submitPerson }
export { deletePerson }

// review
export { saveAnimeReview }
export { fetchAnimeReview }
export { deleteAnimeReview }

// audit
export { fetchRecordsForAuditor }
export { fetchAnimeRecordForAuditor }
export { fetchPersonRecordForAuditor }
// audit-anime
export { approveAnime }
export { denyAnime }
// audit-anime
export { approvePerson }
export { denyPerson }

// admin-anime-record
export { fetchAnimeRecords }
export { fetchAnimeRecord }
export { closeAnimeRecord }
export { openAnimeRecord }
export { rollbackAnimeRecord }
export { deleteAnimeRecord }
// admin-anime
export { fetchAnimes }
// admin-anime-other-name
export { fetchAnimeOtherNames }
// admin-anime-type-genre
export { fetchAnimeTypeGenres }
// admin-anime-region
export { fetchAnimeRegions }
// admin-anime-release-date
export { fetchAnimeReleaseDates }
// admin-anime-copyright
export { fetchAnimeCopyrights }
// admin-anime-staff
export { fetchAnimeStaffs }
// admin-anime-cast
export { fetchAnimeCasts }
// admin-person-record
export { fetchPersonRecords }
export { fetchPersonRecord }
export { closePersonRecord }
export { openPersonRecord }
export { rollbackPersonRecord }
export { deletePersonRecord }
// admin-dictionary-position
export { fetchDictionaryPositions }
export { addDictionaryPosition }
export { updateDictionaryPosition }
export { deleteDictionaryPosition }
// admin-dictionary-person
export { fetchDictionaryPersons }
export { addDictionaryPerson }
export { updateDictionaryPerson }
export { deleteDictionaryPerson }